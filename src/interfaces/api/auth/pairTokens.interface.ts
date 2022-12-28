import { IToken } from '../../entity/token.interface';

export interface IPairTokens extends Pick<IToken,'accessToken' | 'refreshToken'>{

}