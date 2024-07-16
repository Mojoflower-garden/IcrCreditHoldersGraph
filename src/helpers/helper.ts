import {
  Account,
  AccountBalance,
  AccountTransfer,
  Activity,
  Asset,
  ProjectCreated,
  Transaction,
  Transfer,
} from "../../generated/schema";
import { ProjectCreated as ProjectCreatedEvent } from "../../generated/CarbonContractRegistry/CarbonContractRegistry";
import {
  Address,
  BigDecimal,
  BigInt,
  Bytes,
  ethereum,
} from "@graphprotocol/graph-ts";
import { dataSource } from "@graphprotocol/graph-ts";

export const DEBASEMENT_BLOCK = BigInt.fromString("55147487");

export function getAmountDebased(
  currentAmount: BigInt,
  blockNumber: BigInt
): BigInt {
  let amount = currentAmount;
  let context = dataSource.context();
  let isDebased = context.getBoolean("IS_DEBASED");
  if (isDebased && blockNumber < DEBASEMENT_BLOCK) {
    amount = amount.times(BigInt.fromI32(10).pow(18));
  }
  return amount;
}

export function createProjectCreated(
  event: ProjectCreatedEvent,
  projectId: Bytes
): void {
  const transaction = createTransaction(
    event.transaction,
    event.block,
    event.receipt
  );
  let entity = new ProjectCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  entity.projectId = event.params.projectId;
  entity.projectAddress = event.params.projectAddress;
  entity.projectName = event.params.projectName;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.project = projectId;

  entity.save();

  createActivity(
    event.params.projectAddress,
    "ProjectCreated",
    entity.id,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
    event.logIndex,
    event.transactionLogIndex,
    null,
    null,
    transaction
  );
}

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export function isNullAddress(address: Bytes): bool {
  return Address.fromBytes(address) == Address.fromHexString(ADDRESS_ZERO);
}

export function bigDecimalDecimal(decimals: number): BigDecimal {
  let one = "1";
  let zero = "0";
  let num = one + zero.repeat(i32(decimals));
  return BigDecimal.fromString(num);
}

export function handleTransfer(entity: Transfer): void {
  let sender = new AccountTransfer(entity.id.concat(Bytes.fromUTF8("sender")));

  sender.projectAddress = entity.projectAddress;
  sender.from = entity.from;
  sender.to = entity.to;
  sender.tokenId = entity.tokenId;
  sender.value = entity.value;
  sender.blockNumber = entity.blockNumber;
  sender.blockTimestamp = entity.blockTimestamp;
  sender.transactionHash = entity.transactionHash;

  sender.asset = entity.asset;
  sender.project = entity.project;
  sender.transfer = entity.id;
  sender.account = entity.from.toHexString();

  sender.save();

  let receiver = new AccountTransfer(
    entity.id.concat(Bytes.fromUTF8("receiver"))
  );

  receiver.projectAddress = entity.projectAddress;
  receiver.from = entity.from;
  receiver.to = entity.to;
  receiver.tokenId = entity.tokenId;
  receiver.value = entity.value;
  receiver.blockNumber = entity.blockNumber;

  receiver.blockTimestamp = entity.blockTimestamp;
  receiver.transactionHash = entity.transactionHash;
  receiver.asset = entity.asset;
  receiver.project = entity.project;
  receiver.transfer = entity.id;
  receiver.account = entity.to.toHexString();

  receiver.save();

  if (entity.from.toHexString() == entity.to.toHexString()) {
    // If sender === receiver then we don't need to update the account balances
    return;
  }
  if (entity.asset) {
    const asset = Asset.load(entity.asset!);
    if (asset) {
      let sender = Account.load(entity.from.toHexString());
      let receiver = Account.load(entity.to.toHexString());
      // If sender === receiver
      let senderAccountBalance = AccountBalance.load(
        getAccountBalanceId(entity.asset!, entity.from.toHexString())
      );
      let receiverAccountBalance = AccountBalance.load(
        getAccountBalanceId(entity.asset!, entity.to.toHexString())
      );
      if (!sender) {
        sender = new Account(entity.from.toHexString());
        sender.save();
      }
      if (!receiver) {
        receiver = new Account(entity.to.toHexString());
        receiver.save();
      }
      if (!senderAccountBalance) {
        senderAccountBalance = new AccountBalance(
          getAccountBalanceId(entity.asset!, entity.from.toHexString())
        );
        senderAccountBalance.account = sender.id;
        senderAccountBalance.asset = entity.asset!;
        senderAccountBalance.accountAddress = entity.from;
        senderAccountBalance.balance = BigInt.fromI32(0);
        senderAccountBalance.decimalBalance = BigDecimal.fromString("0");
      }

      if (!receiverAccountBalance) {
        receiverAccountBalance = new AccountBalance(
          getAccountBalanceId(entity.asset!, entity.to.toHexString())
        );
        receiverAccountBalance.account = receiver.id;
        receiverAccountBalance.asset = entity.asset!;
        receiverAccountBalance.accountAddress = entity.to;
        receiverAccountBalance.balance = BigInt.fromI32(0);
        receiverAccountBalance.decimalBalance = BigDecimal.fromString("0");
      }

      if (!isNullAddress(entity.from)) {
        // if sender is not null address then it is a transfer - so we need to subtract the value from sender
        senderAccountBalance.balance = senderAccountBalance.balance.minus(
          entity.value
        );
        senderAccountBalance.decimalBalance =
          senderAccountBalance.decimalBalance.minus(
            entity.value.toBigDecimal().div(bigDecimalDecimal(asset.decimals))
          );
      }

      if (isNullAddress(entity.to)) {
        asset.supply = asset.supply.minus(entity.value);
        asset.save();
      }
      if (isNullAddress(entity.from)) {
        // exAnteAsset.supply = exAnteAsset.supply.plus(event.params.amount);
        asset.supply = asset.supply.plus(entity.value);
        asset.save();
      }

      senderAccountBalance.save();

      receiverAccountBalance.balance = receiverAccountBalance.balance.plus(
        entity.value
      );
      receiverAccountBalance.decimalBalance =
        receiverAccountBalance.decimalBalance.plus(
          entity.value.toBigDecimal().div(bigDecimalDecimal(asset.decimals))
        );

      receiverAccountBalance.save();
    }
  }
}

export function createActivity(
  contractAddress: Bytes,
  type: string,
  activityId: Bytes,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  transactionHash: Bytes,
  logIndex: BigInt,
  transactionLogIndex: BigInt,
  extrasAccount: string | null,
  extrasAsset: string | null,
  transaction: Transaction
): void {
  let entity = new Activity(activityId);
  entity.contractAddress = contractAddress;
  entity.type = type;
  entity.blockNumber = blockNumber;
  entity.blockTimestamp = blockTimestamp;
  entity.transactionHash = transactionHash;
  entity.project = contractAddress;

  entity.account = extrasAccount;
  entity.asset = extrasAsset;

  entity.logIndex = logIndex;
  entity.transactionLogIndex = transactionLogIndex;
  entity.transactionId = transaction.id;

  if (type == "ProjectCreated") {
    entity.project = activityId;
  }
  if (type == "AdminClawback") {
    entity.adminClawback = activityId;
  }
  if (type == "CancelledCredits") {
    entity.cancelledCredits = activityId;
  }
  if (type == "ExAnteMinted") {
    entity.exAnteMinted = activityId;
  }
  if (type == "ExPostCreated") {
    entity.exPostCreated = activityId;
  }
  if (type == "ExPostVerifiedAndMinted") {
    entity.exPostVerifiedAndMinted = activityId;
  }
  if (type == "ExchangeAnteForPost") {
    entity.exchangeAnteForPost = activityId;
  }
  if (type == "Retirement") {
    entity.retirement = activityId;
  }
  if (type == "Transfer") {
    entity.transfer = activityId;
  }
  if (type == "VintageMitigationEstimateChanged") {
    entity.vintageMitigationEstimateChanged = activityId;
  }

  entity.save();
}

export function createTransaction(
  transactionData: ethereum.Transaction,
  blockData: ethereum.Block,
  txReceipt: ethereum.TransactionReceipt | null
): Transaction {
  const transaction = Transaction.load(transactionData.hash.toHexString());

  if (transaction) return transaction;

  const newTransaction = new Transaction(transactionData.hash.toHexString());
  newTransaction.from = transactionData.from;
  newTransaction.to = transactionData.to;
  newTransaction.gasLimit = transactionData.gasLimit;
  newTransaction.gasPrice = transactionData.gasPrice;
  newTransaction.hash = transactionData.hash;
  newTransaction.blockNumber = blockData.number;
  newTransaction.blockTimestamp = blockData.timestamp;
  newTransaction.index = transactionData.index;
  newTransaction.nonce = transactionData.nonce;
  newTransaction.value = transactionData.value;
  newTransaction.input = transactionData.input;
  newTransaction.cumulativeGasUsed = txReceipt
    ? txReceipt.cumulativeGasUsed
    : null;
  newTransaction.gasUsed = txReceipt ? txReceipt.gasUsed : null;
  newTransaction.save();
  return newTransaction;
}

export function getAssetId(tokenId: BigInt, contractAddress: Address): string {
  return contractAddress
    .concat(Bytes.fromByteArray(Bytes.fromBigInt(tokenId)))
    .toHexString();
}

export function getVintageId(
  exPostId: BigInt,
  contractAddress: Address
): string {
  return contractAddress
    .concat(Bytes.fromByteArray(Bytes.fromBigInt(exPostId)))
    .toHexString();
}

export function getAccountBalanceId(assetId: string, account: string): string {
  return assetId.concat(account);
}
