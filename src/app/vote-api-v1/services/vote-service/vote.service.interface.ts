export interface IVoteService {
    voteFor(voteFor: string, accessKeyId: number): Promise<IVoteResponse>;
    getVotedItemListForAccessKey(accessKeyId: number, limit: number, offset: number): Promise<IVoteResultsResponse[]>;
}

export interface IVoteFor {
    voteFor: string;
}

export interface IVoteResponse {
    success: boolean;
}

export interface IVoteResultsResponse {
    votes: number;
    position: number;
    name: string;
}
