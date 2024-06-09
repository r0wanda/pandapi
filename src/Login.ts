import got from 'got';
import { Blowfish } from 'egoroof-blowfish';
import Partners from './Partners.js';

export default class Login {
    #user: string;
    #pass: string;
    #enc?: Blowfish;
    #dec?: Blowfish;
    #partner?: Auth.Partner;
    #syncTime?: number;
    auth?: Auth.User;
    token?: string;
    constructor(user = '', pass = '') {
        this.#user = user;
        this.#pass = pass;
    }
    setUser(user: string) {
        this.#user = user;
    }
    setPass(pass: string) {
        this.#pass = pass;
    }
    _url(method: string, params?: { [key: string]: string }) {
        params = params || {};
        const url = new URL('https://tuner.pandora.com/services/json');
        url.searchParams.set('method', method);
        for (const k in params) url.searchParams.set(k, params[k]);
        return url.href;
    }
    /**
     * Check if Pandora is available in your area
     */
    async checkLicensing(): Promise<boolean> {
        const res: Auth.Res = await got(this._url('test.checkLicensing')).json();
        if (res.stat !== 'ok') throw new Error(`Licensing was not ok: ${res.message}`);
        return !!(<Auth.Licensing>res.result)?.isAllowed;
    }
    /**
     * Partner login
     * @param partner The device partner to use. Android is recommended and default. 
     * @returns 
     */
    async partnerLogin(partner: keyof typeof Partners = 'android') {
        const p = Partners[partner];
        if (!p) throw new Error(`Partner username ${partner} is invalid`);
        const r: Auth.Res = await got.post(this._url('auth.partnerLogin'), {
            json: {
                username: partner,
                password: p.pass,
                deviceModel: p.id,
                version: '5'
            }
        }).json();
        const rTime = Date.now();
        this.#enc = new Blowfish(p.encrypt);
        this.#dec = new Blowfish(p.decrypt, Blowfish.MODE.ECB, Blowfish.PADDING.NULL);
        if (r.stat !== 'ok') throw new Error(`Partner login was not ok: ${r.message}`);
        this.#partner = <Auth.Partner>r.result;
        const buf = Buffer.from(this.#partner.syncTime, 'hex');
        const dec = this.#dec.decode(buf, Blowfish.TYPE.UINT8_ARRAY).slice(4);
        const time = parseInt(Buffer.from(dec).toString('utf8'));
        this.#syncTime = rTime - time;
        return this.#partner;
    }
    /**
     * User login, done after partner login.
     */
    async userLogin() {
        if (!this.#partner || !this.#syncTime || !this.#enc) throw new Error('Partner login must be done before user login');
        if (!this.#user || !this.#pass) throw new Error('No username/email or password given');
        const body = {
            loginType: 'user',
            username: this.#user,
            password: this.#pass,
            partnerAuthToken: this.#partner.partnerAuthToken,
            syncTime: Date.now() - this.#syncTime
        }
        const encodedBody = Buffer.from(this.#enc.encode(JSON.stringify(body))).toString('hex');
        const res: Auth.Res = await got.post(this._url('auth.userLogin', {
            auth_token: encodeURIComponent(this.#partner.partnerAuthToken),
            partner_id: this.#partner.partnerId
        }), {
            body: encodedBody
        }).json();
        if (res.stat !== 'ok') throw new Error(`User login was not ok: ${res.message}`);
        const r = <Auth.User>res.result;
        this.auth = r;
        this.token = r.userAuthToken;
        return r;
    }
    /**
     * Login to Pandora
     * @param user Username/email (if not provided in constructor or set manually)
     * @param pass Password (if not provided in constructor or set manually)
     * @returns 
     */
    async login(user?: string, pass?: string) {
        if (user) this.#user = user;
        if (pass) this.#pass = pass;
        if (!await this.checkLicensing()) throw new Error('Pandora is not available in your area');
        await this.partnerLogin();
        return await this.userLogin();
    }
}
