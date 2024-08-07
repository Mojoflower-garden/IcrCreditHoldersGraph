import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import {
  AdminClawback as AdminClawbackEvent,
  CancelledCredits as CancelledCreditsEvent,
  ExAnteMinted as ExAnteMintedEvent,
  ExPostCreated as ExPostCreatedEvent,
  ExPostVerifiedAndMinted as ExPostVerifiedAndMintedEvent,
  ExchangeAnteForPost as ExchangeAnteForPostEvent,
  RetiredVintage as RetiredVintageEvent,
  TransferBatch as TransferBatchEvent,
  TransferSingle as TransferSingleEvent,
  VintageMitigationEstimateChanged as VintageMitigationEstimateChangedEvent,
} from "../generated/ProjectContract/ProjectContract";
import {
  AdminClawback,
  CancelledCredits,
  ExAnteMinted,
  ExPostCreated,
  ExPostVerifiedAndMinted,
  ExchangeAnteForPost,
  Retirement,
  VintageMitigationEstimateChanged,
  Transfer,
  Asset,
  Vintage,
  Account,
  AccountBalance,
} from "../generated/schema";
import {
  handleTransfer,
  createActivity,
  getAssetId,
  getVintageId,
  getAccountBalanceId,
  getAmountDebased,
  createTransaction,
} from "./helpers/helper";

export function handleAdminClawback(event: AdminClawbackEvent): void {
  const transaction = createTransaction(
    event.transaction,
    event.block,
    event.receipt
  );
  let entity = new AdminClawback(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.projectAddress = event.address;
  entity.tokenId = event.params.tokenId;
  entity.amount = event.params.amount;
  entity.reason = event.params.reason;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.project = event.address;
  entity.asset = getAssetId(event.params.tokenId, event.address);
  entity.fromAccount = event.params.from.toHexString();

  entity.save();

  createActivity(
    event.address,
    "AdminClawback",
    entity.id,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
    event.logIndex,
    event.transactionLogIndex,
    null,
    entity.asset,
    transaction
  );
}

export function handleCancelledCredits(event: CancelledCreditsEvent): void {
  const transaction = createTransaction(
    event.transaction,
    event.block,
    event.receipt
  );
  let entity = new CancelledCredits(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  entity.cancellorAddress = event.params.account;
  entity.tokenId = event.params.tokenId;
  entity.amount = getAmountDebased(event.params.amount, event.block.number);
  entity.reason = event.params.reason;
  entity.data = event.params.data;
  entity.projectAddress = event.address;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.project = event.address;
  entity.asset = getAssetId(event.params.tokenId, event.address);
  entity.account = event.params.account.toHexString();

  const asset = Asset.load(getAssetId(event.params.tokenId, event.address));

  if (asset && asset.vintage) {
    const vintage = Vintage.load(asset.vintage);
    if (vintage) {
      if (asset.type == "ExAnte") {
        vintage.totalExAnteCancelledAmount =
          vintage.totalExAnteCancelledAmount.plus(entity.amount);
      } else {
        vintage.totalExPostCancelledAmount =
          vintage.totalExPostCancelledAmount.plus(entity.amount);
      }
      vintage.save();

      entity.vintage = vintage.id;
    }
  }

  entity.save();

  createActivity(
    event.address,
    "CancelledCredits",
    entity.id,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
    event.logIndex,
    event.transactionLogIndex,
    entity.account,
    entity.asset,
    transaction
  );
}

export function handleExAnteMinted(event: ExAnteMintedEvent): void {
  const transaction = createTransaction(
    event.transaction,
    event.block,
    event.receipt
  );
  let entity = new ExAnteMinted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.projectAddress = event.address;
  entity.exAnteTokenId = event.params.exAnteTokenId;
  entity.exPostTokenId = event.params.exPostTokenId;
  entity.to = event.params.account;
  entity.amount = getAmountDebased(
    BigInt.fromString(event.params.amount.toString()),
    event.block.number
  );

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.project = event.address;
  entity.asset = getAssetId(event.params.exAnteTokenId, event.address);
  entity.account = event.params.account.toHexString();

  entity.save();

  let exAnteAsset = Asset.load(
    getAssetId(event.params.exAnteTokenId, event.address)
  );
  const exPostAsset = Asset.load(
    getAssetId(event.params.exPostTokenId, event.address)
  );

  if (exPostAsset) {
    if (!exAnteAsset) {
      exAnteAsset = new Asset(
        getAssetId(event.params.exAnteTokenId, event.address)
      );
      exAnteAsset.projectAddress = event.address;
      exAnteAsset.project = event.address;
      exAnteAsset.tokenId = event.params.exAnteTokenId;
      exAnteAsset.decimals = 18;
      exAnteAsset.serialization = exPostAsset.serialization;
      exAnteAsset.type = "ExAnte";
      exAnteAsset.supply = BigInt.fromI32(0);
      exAnteAsset.vintage = exPostAsset.vintage;
      exAnteAsset.save();
    }

    exAnteAsset.save();

    const vintage = Vintage.load(exPostAsset.vintage);

    if (vintage) {
      vintage.totalExAnteIssued = vintage.totalExAnteIssued.plus(entity.amount);

      vintage.save();
    }
  }

  createActivity(
    event.address,
    "ExAnteMinted",
    entity.id,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
    event.logIndex,
    event.transactionLogIndex,
    entity.account,
    entity.asset,
    transaction
  );
}

export function handleExPostCreated(event: ExPostCreatedEvent): void {
  const transaction = createTransaction(
    event.transaction,
    event.block,
    event.receipt
  );
  let entity = new ExPostCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  entity.projectAddress = event.address;
  entity.tokenId = event.params.tokenId;
  entity.estimatedAmount = event.params.estimatedAmount;
  entity.verificationPeriodStart = event.params.verificationPeriodStart;
  entity.verificationPeriodEnd = event.params.verificationPeriodEnd;
  entity.serialization = event.params.serialization;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.project = event.address;
  entity.asset = getAssetId(event.params.tokenId, event.address);

  entity.save();

  const vintage = new Vintage(
    getVintageId(event.params.tokenId, event.address)
  );
  vintage.project = event.address;
  vintage.serialization = event.params.serialization;
  vintage.estimatedAmount = event.params.estimatedAmount;
  vintage.totalRetiredAmount = BigInt.fromString("0");
  vintage.totalExAnteCancelledAmount = BigInt.fromString("0");
  vintage.totalExPostCancelledAmount = BigInt.fromString("0");
  vintage.totalExPostIssued = BigInt.fromString("0");
  vintage.totalExAnteIssued = BigInt.fromString("0");
  vintage.project = event.address;
  vintage.save();

  const exPostAsset = new Asset(
    getAssetId(event.params.tokenId, event.address)
  );
  exPostAsset.projectAddress = event.address;
  exPostAsset.project = event.address;
  exPostAsset.tokenId = event.params.tokenId;
  exPostAsset.decimals = 18;
  exPostAsset.serialization = event.params.serialization;
  exPostAsset.type = "ExPost";
  exPostAsset.supply = BigInt.fromI32(0);
  exPostAsset.vintage = vintage.id;
  exPostAsset.save();

  createActivity(
    event.address,
    "ExPostCreated",
    entity.id,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
    event.logIndex,
    event.transactionLogIndex,
    null,
    entity.asset,
    transaction
  );
}

export function handleExPostVerifiedAndMinted(
  event: ExPostVerifiedAndMintedEvent
): void {
  const transaction = createTransaction(
    event.transaction,
    event.block,
    event.receipt
  );
  let entity = new ExPostVerifiedAndMinted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.projectAddress = event.address;
  entity.tokenId = event.params.tokenId;
  entity.amount = getAmountDebased(
    BigInt.fromString(event.params.amount.toString()),
    event.block.number
  );
  entity.amountToAnteHolders = event.params.amountToAnteHolders;
  entity.verificationPeriodStart = event.params.verificationPeriodStart;
  entity.verificationPeriodEnd = event.params.verificationPeriodEnd;
  entity.monitoringReport = event.params.monitoringReport;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.project = event.address;
  entity.asset = getAssetId(event.params.tokenId, event.address);

  entity.save();

  const vintage = Vintage.load(
    getVintageId(event.params.tokenId, event.address)
  );

  if (vintage) {
    vintage.totalExPostIssued = vintage.totalExPostIssued.plus(entity.amount);

    vintage.save();
  }

  createActivity(
    event.address,
    "ExPostVerifiedAndMinted",
    entity.id,

    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
    event.logIndex,
    event.transactionLogIndex,
    null,
    entity.asset,
    transaction
  );
}

export function handleExchangeAnteForPost(
  event: ExchangeAnteForPostEvent
): void {
  const transaction = createTransaction(
    event.transaction,
    event.block,
    event.receipt
  );
  let entity = new ExchangeAnteForPost(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.projectAddress = event.address;
  entity.address = event.params.account;
  entity.exPostTokenId = event.params.exPostTokenId;
  entity.exPostAmountReceived = event.params.exPostAmountReceived;
  entity.exAnteAmountBurned = event.params.exAnteAmountBurned;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.project = event.address;
  entity.account = event.params.account.toHexString();

  entity.save();

  createActivity(
    event.address,
    "ExchangeAnteForPost",
    entity.id,

    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
    event.logIndex,
    event.transactionLogIndex,
    entity.account,
    null,
    transaction
  );
}

export function handleRetiredVintage(event: RetiredVintageEvent): void {
  const transaction = createTransaction(
    event.transaction,
    event.block,
    event.receipt
  );
  const vintage = Vintage.load(
    getVintageId(event.params.tokenId, event.address)
  );
  const retirementAsset = new Asset(
    getAssetId(event.params.nftTokenId, event.address)
  );
  retirementAsset.projectAddress = event.address;
  retirementAsset.project = event.address;
  retirementAsset.tokenId = event.params.nftTokenId;
  retirementAsset.decimals = 0;
  retirementAsset.serialization = vintage != null ? vintage.serialization : "";
  retirementAsset.type = "RetirementCertificate";
  retirementAsset.supply = BigInt.fromI32(1);
  retirementAsset.vintage = getVintageId(event.params.tokenId, event.address);
  retirementAsset.save();

  let retireeAccount = Account.load(event.params.account.toHexString());
  if (retireeAccount == null) {
    retireeAccount = new Account(event.params.account.toHexString());
    retireeAccount.save();
  }

  const accountBalance = new AccountBalance(
    getAccountBalanceId(retirementAsset.id, retireeAccount.id)
  );

  accountBalance.account = retireeAccount.id;
  accountBalance.asset = retirementAsset.id;

  accountBalance.accountAddress = event.params.account;
  accountBalance.balance = BigInt.fromI32(1);
  accountBalance.decimalBalance = BigDecimal.fromString(
    event.params.amount.toString()
  );
  accountBalance.save();

  let entity = new Retirement(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  entity.projectAddress = event.address;
  entity.retiree = event.params.account;
  entity.tokenId = event.params.tokenId;
  entity.amount = getAmountDebased(event.params.amount, event.block.number);
  entity.nftTokenId = event.params.nftTokenId;
  entity.data = event.params.data;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.project = event.address;
  entity.asset = getAssetId(event.params.tokenId, event.address);
  entity.account = event.params.account.toHexString();

  entity.vintage = getVintageId(event.params.tokenId, event.address);
  entity.asset = getAssetId(event.params.nftTokenId, event.address);

  entity.save();

  if (vintage) {
    vintage.totalRetiredAmount = vintage.totalRetiredAmount.plus(entity.amount);
    vintage.save();
  }

  createActivity(
    event.address,
    "Retirement",
    entity.id,

    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
    event.logIndex,
    event.transactionLogIndex,
    entity.account,
    entity.asset,
    transaction
  );
}

export function handleTransferBatch(event: TransferBatchEvent): void {
  const transaction = createTransaction(
    event.transaction,
    event.block,
    event.receipt
  );
  for (let i = 0; i < event.params.ids.length; i++) {
    let entity = new Transfer(
      event.transaction.hash.concatI32(event.logIndex.toI32()).concatI32(i)
    );
    entity.projectAddress = event.address;
    entity.from = event.params.from;
    entity.to = event.params.to;
    entity.tokenId = event.params.ids[i];
    entity.value = event.params.values[i];
    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.asset = getAssetId(event.params.ids[i], event.address);
    entity.project = event.address;

    entity.save();

    handleTransfer(entity);

    createActivity(
      event.address,
      "Transfer",
      entity.id,
      event.block.number,
      event.block.timestamp,
      event.transaction.hash,
      event.logIndex,
      event.transactionLogIndex,
      null,
      entity.asset,
      transaction
    );
  }
}

export function handleTransferSingle(event: TransferSingleEvent): void {
  const transaction = createTransaction(
    event.transaction,
    event.block,
    event.receipt
  );
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.projectAddress = event.address;
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.tokenId = event.params.id;
  entity.value = event.params.value;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.asset = getAssetId(event.params.id, event.address);
  entity.project = event.address;

  entity.save();

  handleTransfer(entity);

  createActivity(
    event.address,
    "Transfer",
    entity.id,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
    event.logIndex,
    event.transactionLogIndex,
    null,
    entity.asset,
    transaction
  );
}

export function handleVintageMitigationEstimateChanged(
  event: VintageMitigationEstimateChangedEvent
): void {
  const transaction = createTransaction(
    event.transaction,
    event.block,
    event.receipt
  );
  let entity = new VintageMitigationEstimateChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.projectAddress = event.address;
  entity.tokenId = event.params.tokenId;
  entity.newEstimate = event.params.newEstimate;
  entity.oldEstimate = event.params.oldEstimate;
  entity.reason = event.params.reason;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.project = event.address;

  entity.save();

  createActivity(
    event.address,
    "VintageMitigationEstimateChanged",
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
