export type Post = {
    id: number;
    user: string;
    picture: string;
    action: string;
    actionGoal?: string;
    picPreview?: boolean;
    privateMsg?: string;
    sentWhen: string;
    msgRead: true | false ;
}