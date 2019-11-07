export interface ICommandHandler<ICommand>
{
    Handle(command: ICommand): Promise<void>;
}