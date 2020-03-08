export interface ITokenService {
    addTokenByProvidedCredentials(providedCredentials: IProvidedCredentials): Promise<IToken>;
    checkToken(tokenPayload: IToken): Promise<void>;
}

export interface IProvidedCredentials {
    accessKey: string;
}

export interface IToken {
    accessToken: string;
}
