declare namespace PandoraTypes {
    export type Uuid = string;
    export type NumericId = number;
    export type NumericIdString = string;
    export type FactoryId = string;
    export type UrlPath = string;
    export type Id = string;
    export type ItemType = 'PL' | 'TR' | 'AL' | 'AR' | 'AM' | 'LI' | 'SF' | 'CU' | 'AP' | 'ST' | 'AT';
    export namespace ItemType {
        export type Playlist = 'PL';
        export type PlaylistCurator = 'LI';
        export type Track = 'TR';
        export type Album = 'AL';
        export type Artist = 'AR';
        export type StationCurator = 'SF';
        export type Curator = 'CU';
        export type ArtistPlay = 'AP';
        export type Station = 'ST';
        export type ArtistTracks = 'AT';
    }
    export type UnixTimestamp = number;
    export type UnixTimestampString = string;
    /**
     * string representation of a playlist cover image, details on parsing are contained with in the parseThor Api method.
     */
    export type ThorLayers = string;
    export type ParsedThorLayers = string[];
    export type Seconds = number;
    /**
     * The only known value is "MOST_RECENT_MODIFIED". It is recommended that clients handle sorting themselves.
     */
    export type SortOrder = 'MOST_RECENT_MODIFIED';
    /**
     * Known types are SharedListening, StationThumbs, and None
     * If the type is StationThumbs
     */
    export type LinkedType = 'StationThumbs' | 'SharedListening' | 'None' | string;
    /**
     * Twittet handle does not include the @-symbol
     */
    export type TwitterHandle = string;
    export type ArtUrlFragment = PandoraTypes.UrlPath;
    export type ArtUrl = string;
    export type HexColor = string;
    export type RecentlyPlayedTypename = 'ArtistPlay' | 'Album' | 'Playlist' | 'Station' | 'Deluxe' | string;
    export type StationSort = 'lastPlayedTime' | string;
    export type Pixels = number;
    export type StringDate = string;
    export type CountryCode = 'US' | string;
    export type ProductTier = 'PREMIUM_FAMILY_PLAN' | string;
    export type ProductType = 'PERSISTENT' | string;
    export type DiscountType = 'NONE' | string;
    export type DurationType = 'NONE' | string;
    export type CurrencyCode = 'USD' | string;
    export type PaymentProviderType = 'NONE' | string;
    export type PaymentProvider = 'NONE' | string;
    export type BooleanString = string;
    export type FamilyPlanType = 'CHILD' | 'ADULT' | string;
    export type BillingAccountName = 'X' | string;
    export type ItemLongType = RecentlyPlayedTypename;
    export type Repeat = 'REPEAT_NONE' | string;
    export type PlayerStyle = 'INTERACTIVE' | 'NON_INTERACTIVE' | string;
    export type Interaction = 'SKIP' | 'SEEK' | string;
    export type FloatString = string;
    export type AudioEncoding = 'aacplus' | string;
    export type XORKey = string;
    export type AudioUrl = string;
    export type Year = number;
    export type IntString = string;
    export type Gender = 'MALE' | 'FEMALE' | string;
    export type Milliseconds = number;
    export type Flag = 'onDemand' | 'highQualityStreamingAvailable' | 'adFreeSkip' | 'adFreeReplay' | 'seenWebPremiumWelcome' | string;
    export type Branding = 'PandoraPremium' | string;
    export type Url = string;
    export type AuthToken = string;
    export type Semver = string;
    export type Percentage = number;
    export type Explicit = 'NONE' | 'EXPLICIT' | 'CLEAN';
    export type Status = 'OK' | string;
    export type OneBasedIndex = number;
    export type TicketSource = 'TICKETMASTER' | string;
}

/**
 * pandora json api authentication docs
 * @see {@file}
 * @see {@link https://6xq.net/pandora-apidoc/json/}
 */
declare namespace Auth {
    /**
     * supposedly checks your location via ip?
     * idk if it actually works (TODO), still recommended
     */
    export interface Licensing {
        isAllowed: boolean;
    }
    /**
     * partner login
     * can be ignored for the most part aside from auth token
     */
    export interface Partner {
        stationSkipLimit: number;
        partnerId: string;
        partnerAuthToken: string;
        syncTime: string;
        stationSkipUnit: string;
    }
    /**
     * the user login, needs partner login first
     */
    export interface User {
        /**
         * email
         */
        username: string;
        /**
         * unknown purpose, why wouldn't you be able to listen?
         */
        canListen: boolean;
        /**
         * unknown cross-compatibility with rest api
         * stringified int, not recommended to parse
         */
        userId: string;
        /**
         * stringified int
         */
        listeningTimeoutMinutes: string;
        zeroVolumeNumMutedTracks: number;
        /**
         * useful to know, should be handled by pandora internally
         * has value on plus(?) and premium plans, but can be ignored
         */
        maxStationsAllowed: number;
        zeroVolumeAutoPauseEnabledFlag: boolean;
        /**
         * url path, unknown purpose
         */
        listeningTimeoutAlertsMsgUri: string;
        /**
         * the main feature!!! it's usable in the rest api
         * has different appearance from rest auth tokens, but still works??
         * might be patched, kinda stupid tha they use the same group for both apis
         * at this moment, the rest api login process is still not completely known
         * @see {@link https://github.com/PromyLOPh/pandora-apidoc/issues/45}
         */
        userAuthToken: string;
    }
    /**
     * all requests return this, result is one of the responses above
     */
    export interface Res {
        stat: 'ok' | 'fail';
        message?: string;
        code?: number;
        result?: Licensing | Partner | User;
    }
}

/**
 * annotations have pretty much all of the data you would need for whatever (track, album, artist, etc)
 */
declare namespace Annotations {
    export interface Playlist {
        /**
         * only known value is core
         */
        scope: 'core';
        /**
         * PL: playlist
         */
        type: 'PL';
        /**
         * id in the format "PL:*number*:*number*"
         */
        pandoraId: string;
        version: number;
        name: string;
        /**
         * blank string if blank, not undefined
         */
        description: string;
        /**
         * unix timestamp
         * parse using `new Date(timeCreated)`
         */
        timeCreated: number;
        isPrivate: boolean;
        secret: boolean;
        /**
         * could be None, StationThumbs, or something else maybe
         */
        linkedType: 'None' | 'StationThumbs' | string;
        totalTracks: number;
        /**
         * url path to pandora.com
         */
        shareableUrlPath: string;
        /**
         * images for playlist image grid
         * format: _;grid(images/ *random alphanumeric characters and slashes* /@1/3,images/...)
         * how to parse:
         * remove "_;grid(" part as well as the closing parentheses
         * seperate url paths (using commas "," as delimeters)
         * use "https://content-images.p-cdn.com/" as the base for the url
         * and append "_500W_500H.jpg" to the end as the filename
         * the end result should be something like: https://content-images.p-cdn.com/images/d3/82/30/cb/70a244f19a8d656783613b78/_500W_500H.jpg
         */
        thorLayers: string;
        /**
         * duration in seconds
         */
        duration: number;
        unlocked: boolean;
        /**
         * unix timestamp of last update
         */
        timeLastUpdated: number;
        viewerInfo: {
            editable: boolean;
        }
        autogenForListener: boolean;
        listenerIdInfo: {
            /**
             * listenerid as number
             */
            listenerId: number;
            /**
             * id in format LI:*number*
             */
            listenerPandoraId: string;
            /**
             * 
             */
            listenerIdToken: string;
        }
        /**
         * Usually only tracks
         */
        includedTrackTypes: PandoraTypes.ItemType[];
        collectible: boolean;
        listenerId: PandoraTypes.NumericId;
        listenerPandoraId: PandoraTypes.Id;
        listenerIdToken: string;
    }
    export interface PlaylistCurator {
        pandoraId: PandoraTypes.Id;
        type: PandoraTypes.ItemType.PlaylistCurator;
        listenerId: PandoraTypes.NumericId;
        webname: string;
        fullname: string;
        displayname: string;
    }
    export interface Album {
        name: string;
        sortableName: string;
        releaseDate: PandoraTypes.StringDate;
        duration: PandoraTypes.Seconds;
        trackCount: number;
        isCompilation: boolean;
        icon: OtherPandoraInterfaces.Icon;
        rightsInfo: OtherPandoraInterfaces.Rights;
        tracks: PandoraTypes.Id[];
        artistId: PandoraTypes.Id;
        artistName: string;
        explicitness: PandoraTypes.Explicit;
        shareableUrlPath: PandoraTypes.UrlPath;
        modificationTime: PandoraTypes.UnixTimestamp;
        slugPlusPandoraId: PandoraTypes.UrlPath;
        hasRadio: boolean;
        releaseType: PandoraTypes.ItemLongType;
        listenerReleaseType: PandoraTypes.ItemLongType;
        rawReleaseDate: PandoraTypes.StringDate;
        originalReleaseDate: PandoraTypes.StringDate;
        pandoraId: PandoraTypes.Id;
        type: PandoraTypes.ItemType.Album;
        scope: string;
        visible?: boolean;
    }
    export interface Artist {
        collaboration: boolean;
        primaryArtists: unknown[];
        variousArtist: boolean;
        megastar: boolean;
        hasTakeoverModes: boolean;
        stationFactoryId?: PandoraTypes.FactoryId;
        name: string;
        sortableName: string;
        icon: OtherPandoraInterfaces.Icon;
        hasRadio: boolean;
        albumCount: number;
        trackCount: number;
        shareableUrlPath: PandoraTypes.UrlPath;
        slugPlusPandoraId: PandoraTypes.UrlPath;
        modificationTime: PandoraTypes.UnixTimestamp;
        pandoraId: PandoraTypes.Id;
        type: PandoraTypes.ItemType.Artist;
        scope: string;
        visible?: boolean;
        twitterHandle?: PandoraTypes.TwitterHandle
    }
    export interface Track {
        name: string;
        sortableName: string;
        duration: PandoraTypes.Seconds;
        durationMillis: PandoraTypes.Milliseconds;
        trackNumber: PandoraTypes.OneBasedIndex;
        icon: OtherPandoraInterfaces.Icon;
        rightsInfo: OtherPandoraInterfaces.Rights;
        albumId: PandoraTypes.Id;
        albumName: string;
        artistId: PandoraTypes.Id;
        artistName: string;
        explicitness: PandoraTypes.Explicit;
        shareableUrlPath: PandoraTypes.UrlPath;
        hasRadio: boolean;
        modificationTime: PandoraTypes.UnixTimestamp;
        slugPlusPandoraId: PandoraTypes.UrlPath;
        stationFactoryId: PandoraTypes.FactoryId;
        isrc: string;
        pandoraId: PandoraTypes.Id;
        type: PandoraTypes.ItemType.Track;
        scope: string;
        visible?: boolean;
    }
}
declare type Annotations = Annotations.Album | Annotations.Artist | Annotations.Track | Annotations.Playlist;

declare namespace PandoraGraphQLEntities {
    export interface StationCurator {
        pandoraId: PandoraTypes.Id;
        curator: {
            pandoraId: PandoraTypes.Id;
            name: string;
            shareableUrlPath: PandoraTypes.UrlPath;
            artist: null;
        } | null;
    }
    export interface ArtistDetails {
        id: PandoraTypes.Id;
        type: PandoraTypes.ItemType.Artist;
        urlPath: PandoraTypes.UrlPath;
        name: string;
        trackCount: number;
        albumCount: number;
        bio: string;
        canSeedStation: boolean;
        stationListenerCount: number;
        artistTracksId: PandoraTypes.Id;
        art: OtherPandoraInterfaces.Icon;
        isMegastar: boolean;
        headerArt: Partial<OtherPandoraInterfaces.Icon>;
        topTracksWithCollaborations: Annotations.Track[];
        artistPlay: PandoraTypes.Id;
        events: OtherPandoraInterfaces.Concert[];
        latestReleaseWihCollaborations: Annotations;
        topAlbumsWithCollaborations: Annotations.Album[];
        similarArtists: PandoraComplexItems.Artist[];
        twitterHandle: string | null;
        twitterUrl: string | null;
        allArtistAlbums: {
            totalItems: number;
            __typename?: 'ArtistAllAlbums';
        }
        curator: PandoraSimpleItems.Curator;
        featured: any[];
        __typename?: 'Artist';
    }
}
declare type PandoraGraphQLEntity = PandoraGraphQLEntities.StationCurator;

declare namespace PandoraSimpleItems {
    export interface Track {
        pandoraId: PandoraTypes.Id;
        pandoraType: PandoraTypes.ItemType.Track;
        albumPandoraId: PandoraTypes.Id;
        addedTime: PandoraTypes.UnixTimestamp;
        updatedTime: PandoraTypes.UnixTimestamp;
    }
    export interface Playlist {
        pandoraId: PandoraTypes.FactoryId;
        pandoraType: PandoraTypes.ItemType.Playlist;
        linkedType: PandoraTypes.LinkedType;
        linkedSourceId: string;
        addedTime: PandoraTypes.UnixTimestamp;
        updatedTime: PandoraTypes.UnixTimestamp;
        ownerId?: PandoraTypes.NumericId;
        ownerPandoraId?: PandoraTypes.Id;
    }
    export interface Album {
        pandoraId: PandoraTypes.Id;
        pandoraType: PandoraTypes.ItemType.Album;
        addedTime: PandoraTypes.UnixTimestamp;
        updatedTime: PandoraTypes.UnixTimestamp;
    }
    export interface Curator {
        curatedStations: {
            /**
             * implied to be a string array, haven't tested (TODO)
             */
            items: any[];
            __typename?: 'CuratorStationFactories';
        }
        /**
         * implied to be an array of some type, haven't tested (TODO)
         */
        playlists: any[] | null;
    }
}

declare type PandoraSimpleItem = PandoraSimpleItems.Album | PandoraSimpleItems.Playlist | PandoraSimpleItems.Track;

declare namespace OtherPandoraInterfaces {
    export interface Icon {
        artId: PandoraTypes.ArtUrlFragment;
        dominantColor: PandoraTypes.HexColor | null;
        artUrl: PandoraTypes.ArtUrl;
        __typename?: 'Art';
    }
    export interface Art {
        url: PandoraTypes.ArtUrl;
        size: PandoraTypes.Pixels;
    }
    export interface Rights {
        expirationTime: PandoraTypes.UnixTimestampString;
        hasInteractive: boolean;
        hasNonInteractive?: boolean;
        hasRadioRights: boolean;
        hasOffline: boolean;
        hasStatutory?: boolean;
        __typename?: 'Rights';
    }
    export interface Concert {
        id: string;
        date: PandoraTypes.StringDate;
        latitude: number;
        longitude: number;
        url: PandoraTypes.Url;
        ticketSource: PandoraTypes.TicketSource;
        onSaleDate: PandoraTypes.StringDate;
        venueName: string;
        city: string;
        /**
         * 2-letter state code, such as CA
         * Pandora is not available outside of the US
         */
        state: string;
        publishedDate: PandoraTypes.StringDate;
        isFeatured: boolean;
        artistUid: string;
        artistPandoraId: PandoraTypes.Id;
        otherArtistUids: string[];
        otherArtistPandoraIds: PandoraTypes.Id[];
    }
}

declare namespace PandoraComplexItems {
    export interface Artist {
        id: PandoraTypes.Id;
        name: string;
        art: OtherPandoraInterfaces.Icon;
        urlPath: PandoraTypes.UrlPath;
        __typename?: 'Artist';
    }
    export interface Playlist {
        name: string;
        pandoraId: PandoraTypes.FactoryId;
        pandoraType: PandoraTypes.ItemType.Playlist;
        addedTime: PandoraTypes.UnixTimestamp;
        updatedTime: PandoraTypes.UnixTimestamp;
    }
    export interface RecentlyPlayed {
        sourceEntity: {
            id: PandoraTypes.Id;
            type: PandoraTypes.ItemType;
            name?: string;
            isCollected?: boolean;
            shareableUrlPath?: PandoraTypes.UrlPath;
            artist?: {
                id: PandoraTypes.Id;
                name: string;
                shareableUrlPath: PandoraTypes.UrlPath;
                icon?: OtherPandoraInterfaces.Icon;
                __typename: string;
            }
            icon?: OtherPandoraInterfaces.Icon;
            rightsInfo?: OtherPandoraInterfaces.Rights;
            totalTracks?: number;
            isEditable?: boolean;
            hasVoiceTrack?: boolean;
            listenerIdInfo?: {
                id: PandoraTypes.Id;
                displayName: string;
                isMe: boolean;
                __typename: 'Profile';
            }
            __typename: PandoraTypes.RecentlyPlayedTypename;
        }
        __typename: 'RecentlyPlayedSource';
    }
    export interface Station {
        stationId: PandoraTypes.NumericIdString;
        stationFactoryPandoraId: PandoraTypes.FactoryId;
        pandoraId: PandoraTypes.Id;
        name: string;
        art: OtherPandoraInterfaces.Art[];
        dateCreated: PandoraTypes.StringDate;
        lastPlayed: PandoraTypes.StringDate;
        totalPlayTime: PandoraTypes.Seconds;
        isNew: boolean;
        allowDelete: boolean;
        allowRename: boolean;
        allowEditDescription: boolean;
        allowAddSeed: boolean;
        isShared: boolean;
        isOnDemandEditorialStation: boolean;
        isAdvertiserStation: boolean;
        canShuffleStation: boolean;
        canAutoShare: boolean;
        advertisingKey: string;
        isArtistMessagesEnabmled: boolean;
        isThumbprint: boolean;
        isShuffle: boolean;
        genre: unknown[];
        genreSponsorship: string;
        initialSeed: {
            musicId: string;
            pandoraId: PandoraTypes.Id;
        }
        adkv: {
            artist: string;
            genre: string;
            clean: string;
            gcat: string;
        }
        creatorWebname: string;
        artId: PandoraTypes.ArtUrlFragment;
        dominantColor: PandoraTypes.HexColor;
        listenerId: PandoraTypes.Id;
        deleted: boolean;
        stationType: PandoraTypes.ItemType.Station;
        timeAdded: PandoraTypes.StringDate;
        lastUpdated: PandoraTypes.StringDate;
        hasTakeoverModes: boolean;
        hasCuratedModes: boolean;
        stationNameWithTwitterHandle?: string;
    }
}

declare namespace PandoraRest {
    export interface Playlists {
        view: PandoraTypes.ItemType.Playlist;
        listenerId: PandoraTypes.NumericId;
        listenerPandoraId: PandoraTypes.Id;
        totalCount: number;
        offset: number;
        limit: number;
        annotations: {
            [key: PandoraTypes.FactoryId]: Annotations.Playlist | Annotations.PlaylistCurator;
        }
        sortOrder: PandoraTypes.SortOrder;
        version: number;
        items: PandoraComplexItems.Playlist[];
    }
    export interface Items {
        listenerId: PandoraTypes.NumericId;
        limit: number;
        version: PandoraTypes.UnixTimestamp;
        items: PandoraSimpleItem[];
    }
    export interface Stations {
        totalStations: number;
        sortedBy: PandoraTypes.StationSort;
        index: number;
        stations: PandoraComplexItems.Station[];
    }
    export interface Info {
        subscriber: boolean;
        giftee: boolean;
        inPaymentBackedTrial: boolean;
        activeProduct: {
            billingTerritory: PandoraTypes.CountryCode;
            productTier: PandoraTypes.ProductTier;
            productType: PandoraTypes.ProductType;
            discountType: PandoraTypes.DiscountType;
            durationType: PandoraTypes.DurationType;
            durationTime: number;
            price: number;
            acceptedCurrency: PandoraTypes.CurrencyCode;
            paymentProviderType: PandoraTypes.PaymentProviderType;
            paymentProvider: PandoraTypes.PaymentProvider;
            displayablePaymentProvider: string;
            productDetails: {
                ipg: PandoraTypes.BooleanString;
                familyPlanType?: PandoraTypes.FamilyPlanType;
                productDescription: string;
            }
        }
        pendingProducts: string;
        autoRenew: boolean;
        paymentProviderType: PandoraTypes.PaymentProviderType;
        paymentProvider: PandoraTypes.PaymentProvider;
        displayablePaymentProvider: string;
        ipgEligible: boolean;
        billingAccountName: PandoraTypes.BillingAccountName;
    }
    export interface OgSource {
        type: PandoraTypes.ItemLongType;
        pandoraId: PandoraTypes.Id;
        repeat: PandoraTypes.Repeat;
        shuffle: boolean;
        currentIndex: number;
        sourceName: string;
        artistName: string;
        mode?: {
            modeId: PandoraTypes.Id;
            modeName: string;
        }
    }
    export interface Source {
        item: {
            index: number;
            type: PandoraTypes.ItemLongType;
            pandoraId: PandoraTypes.Id;
            sourceId: PandoraTypes.Id;
            itemId: PandoraTypes.Id;
            audioUrl: PandoraTypes.AudioUrl;
            key?: PandoraTypes.XORKey;
            encoding: PandoraTypes.AudioEncoding;
            filegain: PandoraTypes.FloatString;
            artId: PandoraTypes.ArtUrlFragment;
            interactions: PandoraTypes.Interaction[];
            playerStyle: PandoraTypes.PlayerStyle;
            songName: string;
            albumName: string;
            artistName: string;
            duration: PandoraTypes.Seconds;
            trackToken: string;
            currentProgress: number;
            artUrl: PandoraTypes.ArtUrl;
        }
        annotations: {
            [key: PandoraTypes.Id]: Annotations.Album | Annotations.Artist | Annotations.Track;
        }
        source: OgSource;
    }
    export interface Peek extends Omit<Source, 'source'> {};
    export interface Skip extends Peek {}; // same response as peek
    export interface Concerts {
        artistEvents: OtherPandoraInterfaces.Concert[]
    }
    export interface Products {
        listenerId: PandoraTypes.NumericId;
        billingTerritory: PandoraTypes.CountryCode;
        productGroups: unknown[];
    }
    export interface SortedTypes {
        listenerId: PandoraTypes.NumericId;
        listenerPandoraId: PandoraTypes.Id;
        totalCount: number;
        offset: number;
        limit: number;
        annotations: {
            [key: PandoraTypes.Id]: Annotations.Album | Annotations.Playlist | Annotations.Artist | Annotations.Track;
        }
        sortOrder: PandoraTypes.SortOrder;
        version: number;
        items: PandoraSimpleItem[];
    }
    export interface Annotate {
        [key: PandoraTypes.Id]: Annotations.Album | Annotations.Artist | Annotations.Album;
    }
    export type Version = PandoraTypes.IntString;
    export interface RemoveTracks { // /api/v7/playlists/deleteTracks
        status: PandoraTypes.Status;
        pandoraId: PandoraTypes.Id;
        version: number;
        name: string;
        description: string;
        timeCreated: PandoraTypes.UnixTimestamp;
        isPrivate: boolean;
        secret: boolean;
        linkedType: PandoraTypes.LinkedType;
        totalTracks: number;
        shareableUrlPath: PandoraTypes.UrlPath;
        thorLayers: PandoraTypes.ThorLayers;
        duration: PandoraTypes.Seconds;
        unlocked: boolean;
        timeLastUpdated: PandoraTypes.UnixTimestamp;
        viewerInfo: {
            editable: boolean;
        }
        autogenForListener: boolean;
        listenerIdInfo: {
            listenerId: PandoraTypes.NumericId;
            listenerPandoraId: PandoraTypes.Id;
            listenerIdToken: string;
        }
        collectible: boolean;
        listenerId: PandoraTypes.NumericId;
        listenerPandoraId: PandoraTypes.Id;
        listenerIdToken: string;
    }
    export interface GraphQL {
        data: {
            entity?: PandoraGraphQLEntity;
            entities?: PandoraGraphQLEntity[];
            recentlyPlayedSources?: {
                items: PandoraComplexItems.RecentlyPlayed[];
                /**
                 * Should bear some resemblence to the sent OperationName
                 */
                __typename: string;
            }
        }
    }
    export interface Sailthru {
        version: string;
    }
}
declare type PandoraRest = PandoraRest.Playlists 
                         | PandoraRest.Items 
                         | PandoraRest.GraphQL 
                         | PandoraRest.Stations 
                         | PandoraRest.Info 
                         | PandoraRest.Source 
                         | PandoraRest.Peek 
                         | PandoraRest.Skip
                         | PandoraRest.Concerts
                         | PandoraRest.Products
                         | PandoraRest.Version;


// End of Pandora API responses

declare namespace PandoraReq {
    export interface Playlists {
        allowedTypes: PandoraTypes.ItemType[];
        isRecentModifiedPlaylists: boolean;
        request: {
            annotationLimit: number;
            limit: number;
            sortOrder: 'MOST_RECENT_MODIFIED';
        }
    }
    export interface Stations {
        pageSize: number;
    }
    export interface GraphQl {
        operationName: string;
        query: string;
        variables: string;
    }
}

declare namespace Parsed {
    export interface PlaylistItem extends PandoraComplexItems.Playlist, Annotations.Playlist {
        addedTime: Date;
        updatedTime: Date;
        timeCreated: Date;
        timeLastUpdated: Date;
    }
    export interface Playlists {
        view: 'PL';
        listenerId: PandoraTypes.NumericId;
        listenerPandoraId: PandoraTypes.Id;
        totalCount: number;
        offset: number;
        limit: number;
        sortOrder: 'MOST_RECENT_MODIFIED';
        items: PItem[];
        listeners: Annotations.PlaylistCurator[];
    }
    export interface StationItem extends PandoraComplexItems.Station {
        dateCreated: Date;
        lastPlayed: Date;
        timeAdded: Date;
        lastUpdated: Date;
    }
    export interface Stations extends PandoraRest.Stations {
        stations: StationItem[];
    }
}
