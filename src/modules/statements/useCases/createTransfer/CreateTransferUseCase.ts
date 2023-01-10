import { IStatementsRepository } from "modules/statements/repositories/IStatementsRepository";
import { IUsersRepository } from "modules/users/repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";
import { CreateTransferError } from "./CreateTransferError";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

@injectable()
class CreateTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({
    recipient_id,
    sender_id,
    amount,
    description
  }: ICreateTransferDTO) {
    const user = await this.usersRepository.findById(sender_id)

    if(!user) {
      throw new CreateTransferError.UserNotFound()
    }

    const recipientUser = await this.usersRepository.findById(recipient_id)

    if(!recipientUser) {
      throw new CreateTransferError.RecipientNotFound()
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id })

    if(balance < amount) {
      throw new CreateTransferError.InsufficientFunds()
    }

  }
}

export { CreateTransferUseCase }
