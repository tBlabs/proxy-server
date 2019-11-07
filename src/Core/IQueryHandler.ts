export interface IQueryHandler<IQuery, TResult>
{
    Handle(query: IQuery) : Promise<TResult>;
}