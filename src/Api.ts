import got from 'got';
import UserAgent from 'user-agents';
import { randomUUID } from 'node:crypto';
import { CookieJar, Cookie } from 'tough-cookie';
import Login from './Login.js';

export default class Api extends Login {
    csrf?: string;
    ua: string;
    cookieJar: CookieJar;
    uuid: string;
    healthy: boolean;
    constructor(user?: string, pass?: string) {
        super(user, pass);
        this.cookieJar = new CookieJar();
        this.ua = new UserAgent().toString();
        this.uuid = randomUUID();
        this.healthy = true;
    }
    static async init(user: string, pass: string) {
        const a = new Api(user, pass);
        if (!a.auth) await a.login();
        if (!a.csrf) await a.initCsrf();
        console.log(a.auth);
        return a;
    }
    async login(user?: string, pass?: string) {
        const lg = await super.login(user, pass);
        return lg;
    }
    /**
     * Get csrftoken cookie from the Pandora website through a head request
     */
    async initCsrf() {
        if (this.csrf) return this.csrf;
        const res = await got('https://www.pandora.com', {
            method: 'HEAD'
        });
        if (!res.headers['set-cookie']) throw new Error('Pandora HEAD request did not contain a set-cookie header');
        for (const _c of res.headers['set-cookie']) {
            if (!_c) continue;
            const parsed = Cookie.parse(_c);
            if (!parsed) continue;
            const c = parsed.toJSON();
            if (c.key === 'csrftoken') {
                this.csrf = c.value;
                break;
            }
        }
        if (!this.csrf) throw new Error('No CSRF token could be obtained');
        await this.cookieJar.setCookie(`csrftoken=${this.csrf}`, 'https://www.pandora.com');
        return this.csrf;
    }
    /**
     * Make an generic Pandora api call
     * @param path The url path (https://www.pandora.com will be prepended as the url base)
     * @param json POST data to send (in json format)
     * @param headers Additional headers to send
     * @param search Search/query params
     * @returns Pandora api response
     */
    async rest<B extends { [key: string]: any; }, R extends { [key: string]: any; }>(path: string, json: B = <B>{}, headers = {}, search = {}): Promise<R> {
        if (!this.csrf || !this.token) throw new TypeError('CSRF Token or Auth Token are undefined')
        const url = new URL('https://www.pandora.com/');
        url.pathname = path;
        for (const k in search) url.searchParams.set(k, search[<keyof typeof search>k]);
        const res: PandoraRest = await got(url.href, {
            method: 'POST',
            headers: {
                'X-CsrfToken': this.csrf,
                'X-AuthToken': this.token,
                'Content-Type': 'application/json',
                'User-Agent': this.ua,
                'Accept': 'application/json, text/plain, */*',
                'Connection': 'keep-alive',
                ...headers
            },
            body: JSON.stringify(json),
            cookieJar: this.cookieJar
        }).json();
        return <R><unknown>res;
    }
    /**
     * radio-health method (optional)
     * @returns The HTML response
     */
    async radioHealth(): Promise<string> {
        const r = await got('https://www.pandora.com/radio-health', {
            headers: {
                'User-Agent': this.ua
            }
        }).text();
        if (!r.toLowerCase().includes('ok')) {
            this.healthy = false;
            throw new Error('Radio Health not OK!');
        } else if (!this.healthy) this.healthy = true;
        return r;
    }
    /**
     * sailthru.json (optional)
     * @param v Version
     * @returns The json response
     */
    async sailthru(v = '1.266.0') {
        const r = await got({
            url: `https://www.pandora.com/web-version/${v}/sailthru.json?v=${Date.now()}`,
            headers: {
                'User-Agent': this.ua
            }
        }).json();
        return <PandoraRest.Sailthru>r;
    }
    /**
     * getSortedPlaylists v6
     * @param raw Return raw response from pandora
     * @param req Response object
     * @returns Raw response or combined annotations/items
     */
    async sortedPlaylists<B extends boolean = false>(raw: B = <B>false, req?: PandoraReq.Playlists): Promise<B extends true ? PandoraRest.Playlists : Parsed.Playlists> {
        const r = await this.rest<PandoraReq.Playlists, PandoraRest.Playlists>('/api/v6/collections/getSortedPlaylists', req || {
            allowedTypes: ['TR', 'AM'],
            isRecentModifiedPlaylists: false,
            request: {
                annotationLimit: 100,
                limit: 1000,
                sortOrder: 'MOST_RECENT_MODIFIED'
            }
        });
        if (raw) return <any>r;
        else {
            const p: Parsed.Playlists = {
                ...r,
                items: r.items.map((i) => {
                    const a = <Annotations.Playlist>r.annotations[i.pandoraId];
                    const res: Parsed.PlaylistItem = {
                        ...i,
                        ...a,
                        addedTime: new Date(i.addedTime),
                        updatedTime: new Date(i.updatedTime),
                        timeCreated: new Date(a.timeCreated),
                        timeLastUpdated: new Date(a.timeLastUpdated)
                    }
                    delete r.annotations[i.pandoraId];
                    return res;
                }),
                listeners: Object.values(r.annotations).filter(<(a: Annotations.Playlist | Annotations.PlaylistCurator) => a is Annotations.PlaylistCurator>((a) => {
                    return a.type === 'LI';
                }))
            }
            return <any>p;
        }
    }
    /**
     * getItems v6
     */
    async getItems() {
        return await this.rest<{}, PandoraRest.Items>('/api/v6/collections/getItems');
    }
    /**
     * infoV2 v1
     */
    async infoV2() {
        return await this.rest<{}, PandoraRest.Info>('/api/v1/billing/infoV2');
    }
    /**
     * getStations v1
     * @remarks Do not use type parameters
     * @param raw Return raw response from pandora
     * @param pageSize Items per page
     * @returns Raw response or processed response
     */
    async stations<B extends boolean = false>(raw: B = <B>false, pageSize = 250): Promise<B extends true ? PandoraRest.Info : Parsed.Stations> {
        const r = await this.rest<PandoraReq.Stations, PandoraRest.Stations>('/api/v1/station/getStations');
        if (raw) return <any>r;
        else {
            const s: Parsed.Stations = {
                ...r,
                stations: r.stations.map((st) => {
                    return {
                        ...st,
                        dateCreated: new Date(st.dateCreated),
                        lastPlayed: new Date(st.lastPlayed),
                        timeAdded: new Date(st.timeAdded),
                        lastUpdated: new Date(st.lastUpdated)
                    }
                })
            }
            return <any>s;
        }
    }
    async graphql(oper: string, query: string, vars: string | object) {
        const variables = typeof vars === 'string' ? vars : JSON.stringify(vars);
        return await this.rest<PandoraReq.GraphQl, {}>('/api/v1/graphql/graphql', {
            operationName: oper,
            query,
            variables
        });
    }
    /**
     * getAvailableProducts v2
     */
    async availableProducts() {
        return await this.rest<{}, PandoraRest.Products>('/api/v2/charon/getAvailableProducts');
    }
    /**
     * community sso
     */
    async sso() {
        await this.rest('/community/sso', {}, { 'Content-Type': 'application/x-www-form-urlencoded' }, {
            auth_token: this.token
        });
    }
    /**
     * getCreditCardV2 v1
     */
    async getCreditCardV2() {
        await this.rest('/api/v1/billing/getCreditCardV2');
    }
}