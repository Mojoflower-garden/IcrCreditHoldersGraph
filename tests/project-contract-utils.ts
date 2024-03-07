import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  AdminBurn,
  AdminChanged,
  AdminClawback,
  ApprovalForAll,
  BeaconUpgraded,
  CancelledCredits,
  EIP712DomainChanged,
  ExAnteMinted,
  ExPostCreated,
  ExPostVerifiedAndMinted,
  ExchangeAnteForPost,
  Initialized,
  Paused,
  RetiredVintage,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  TransferBatch,
  TransferSignatureValid,
  TransferSingle,
  URI,
  Unpaused,
  Upgraded,
  VintageMitigationEstimateChanged
} from "../generated/ProjectContract/ProjectContract"

export function createAdminBurnEvent(
  from: Address,
  tokenId: BigInt,
  amount: BigInt,
  reason: i32
): AdminBurn {
  let adminBurnEvent = changetype<AdminBurn>(newMockEvent())

  adminBurnEvent.parameters = new Array()

  adminBurnEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  adminBurnEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  adminBurnEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  adminBurnEvent.parameters.push(
    new ethereum.EventParam(
      "reason",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(reason))
    )
  )

  return adminBurnEvent
}

export function createAdminChangedEvent(
  previousAdmin: Address,
  newAdmin: Address
): AdminChanged {
  let adminChangedEvent = changetype<AdminChanged>(newMockEvent())

  adminChangedEvent.parameters = new Array()

  adminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousAdmin",
      ethereum.Value.fromAddress(previousAdmin)
    )
  )
  adminChangedEvent.parameters.push(
    new ethereum.EventParam("newAdmin", ethereum.Value.fromAddress(newAdmin))
  )

  return adminChangedEvent
}

export function createAdminClawbackEvent(
  from: Address,
  to: Address,
  tokenId: BigInt,
  amount: BigInt,
  reason: i32
): AdminClawback {
  let adminClawbackEvent = changetype<AdminClawback>(newMockEvent())

  adminClawbackEvent.parameters = new Array()

  adminClawbackEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  adminClawbackEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  adminClawbackEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  adminClawbackEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  adminClawbackEvent.parameters.push(
    new ethereum.EventParam(
      "reason",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(reason))
    )
  )

  return adminClawbackEvent
}

export function createApprovalForAllEvent(
  account: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createBeaconUpgradedEvent(beacon: Address): BeaconUpgraded {
  let beaconUpgradedEvent = changetype<BeaconUpgraded>(newMockEvent())

  beaconUpgradedEvent.parameters = new Array()

  beaconUpgradedEvent.parameters.push(
    new ethereum.EventParam("beacon", ethereum.Value.fromAddress(beacon))
  )

  return beaconUpgradedEvent
}

export function createCancelledCreditsEvent(
  account: Address,
  tokenId: BigInt,
  amount: BigInt,
  reason: string,
  data: Bytes
): CancelledCredits {
  let cancelledCreditsEvent = changetype<CancelledCredits>(newMockEvent())

  cancelledCreditsEvent.parameters = new Array()

  cancelledCreditsEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  cancelledCreditsEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  cancelledCreditsEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  cancelledCreditsEvent.parameters.push(
    new ethereum.EventParam("reason", ethereum.Value.fromString(reason))
  )
  cancelledCreditsEvent.parameters.push(
    new ethereum.EventParam("data", ethereum.Value.fromBytes(data))
  )

  return cancelledCreditsEvent
}

export function createEIP712DomainChangedEvent(): EIP712DomainChanged {
  let eip712DomainChangedEvent = changetype<EIP712DomainChanged>(newMockEvent())

  eip712DomainChangedEvent.parameters = new Array()

  return eip712DomainChangedEvent
}

export function createExAnteMintedEvent(
  exAnteTokenId: BigInt,
  exPostTokenId: BigInt,
  account: Address,
  amount: BigInt
): ExAnteMinted {
  let exAnteMintedEvent = changetype<ExAnteMinted>(newMockEvent())

  exAnteMintedEvent.parameters = new Array()

  exAnteMintedEvent.parameters.push(
    new ethereum.EventParam(
      "exAnteTokenId",
      ethereum.Value.fromUnsignedBigInt(exAnteTokenId)
    )
  )
  exAnteMintedEvent.parameters.push(
    new ethereum.EventParam(
      "exPostTokenId",
      ethereum.Value.fromUnsignedBigInt(exPostTokenId)
    )
  )
  exAnteMintedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  exAnteMintedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return exAnteMintedEvent
}

export function createExPostCreatedEvent(
  tokenId: BigInt,
  estimatedAmount: BigInt,
  verificationPeriodStart: BigInt,
  verificationPeriodEnd: BigInt,
  serialization: string
): ExPostCreated {
  let exPostCreatedEvent = changetype<ExPostCreated>(newMockEvent())

  exPostCreatedEvent.parameters = new Array()

  exPostCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  exPostCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "estimatedAmount",
      ethereum.Value.fromUnsignedBigInt(estimatedAmount)
    )
  )
  exPostCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "verificationPeriodStart",
      ethereum.Value.fromUnsignedBigInt(verificationPeriodStart)
    )
  )
  exPostCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "verificationPeriodEnd",
      ethereum.Value.fromUnsignedBigInt(verificationPeriodEnd)
    )
  )
  exPostCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "serialization",
      ethereum.Value.fromString(serialization)
    )
  )

  return exPostCreatedEvent
}

export function createExPostVerifiedAndMintedEvent(
  tokenId: BigInt,
  amount: BigInt,
  amountToAnteHolders: BigInt,
  verificationPeriodStart: BigInt,
  verificationPeriodEnd: BigInt,
  monitoringReport: string
): ExPostVerifiedAndMinted {
  let exPostVerifiedAndMintedEvent = changetype<ExPostVerifiedAndMinted>(
    newMockEvent()
  )

  exPostVerifiedAndMintedEvent.parameters = new Array()

  exPostVerifiedAndMintedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  exPostVerifiedAndMintedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  exPostVerifiedAndMintedEvent.parameters.push(
    new ethereum.EventParam(
      "amountToAnteHolders",
      ethereum.Value.fromUnsignedBigInt(amountToAnteHolders)
    )
  )
  exPostVerifiedAndMintedEvent.parameters.push(
    new ethereum.EventParam(
      "verificationPeriodStart",
      ethereum.Value.fromUnsignedBigInt(verificationPeriodStart)
    )
  )
  exPostVerifiedAndMintedEvent.parameters.push(
    new ethereum.EventParam(
      "verificationPeriodEnd",
      ethereum.Value.fromUnsignedBigInt(verificationPeriodEnd)
    )
  )
  exPostVerifiedAndMintedEvent.parameters.push(
    new ethereum.EventParam(
      "monitoringReport",
      ethereum.Value.fromString(monitoringReport)
    )
  )

  return exPostVerifiedAndMintedEvent
}

export function createExchangeAnteForPostEvent(
  account: Address,
  exPostTokenId: BigInt,
  exPostAmountReceived: BigInt,
  exAnteAmountBurned: BigInt
): ExchangeAnteForPost {
  let exchangeAnteForPostEvent = changetype<ExchangeAnteForPost>(newMockEvent())

  exchangeAnteForPostEvent.parameters = new Array()

  exchangeAnteForPostEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  exchangeAnteForPostEvent.parameters.push(
    new ethereum.EventParam(
      "exPostTokenId",
      ethereum.Value.fromUnsignedBigInt(exPostTokenId)
    )
  )
  exchangeAnteForPostEvent.parameters.push(
    new ethereum.EventParam(
      "exPostAmountReceived",
      ethereum.Value.fromUnsignedBigInt(exPostAmountReceived)
    )
  )
  exchangeAnteForPostEvent.parameters.push(
    new ethereum.EventParam(
      "exAnteAmountBurned",
      ethereum.Value.fromUnsignedBigInt(exAnteAmountBurned)
    )
  )

  return exchangeAnteForPostEvent
}

export function createInitializedEvent(version: i32): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(version))
    )
  )

  return initializedEvent
}

export function createPausedEvent(account: Address): Paused {
  let pausedEvent = changetype<Paused>(newMockEvent())

  pausedEvent.parameters = new Array()

  pausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return pausedEvent
}

export function createRetiredVintageEvent(
  account: Address,
  tokenId: BigInt,
  amount: BigInt,
  nftTokenId: BigInt,
  data: Bytes
): RetiredVintage {
  let retiredVintageEvent = changetype<RetiredVintage>(newMockEvent())

  retiredVintageEvent.parameters = new Array()

  retiredVintageEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  retiredVintageEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  retiredVintageEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  retiredVintageEvent.parameters.push(
    new ethereum.EventParam(
      "nftTokenId",
      ethereum.Value.fromUnsignedBigInt(nftTokenId)
    )
  )
  retiredVintageEvent.parameters.push(
    new ethereum.EventParam("data", ethereum.Value.fromBytes(data))
  )

  return retiredVintageEvent
}

export function createRoleAdminChangedEvent(
  role: Bytes,
  previousAdminRole: Bytes,
  newAdminRole: Bytes
): RoleAdminChanged {
  let roleAdminChangedEvent = changetype<RoleAdminChanged>(newMockEvent())

  roleAdminChangedEvent.parameters = new Array()

  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousAdminRole",
      ethereum.Value.fromFixedBytes(previousAdminRole)
    )
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newAdminRole",
      ethereum.Value.fromFixedBytes(newAdminRole)
    )
  )

  return roleAdminChangedEvent
}

export function createRoleGrantedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleGranted {
  let roleGrantedEvent = changetype<RoleGranted>(newMockEvent())

  roleGrantedEvent.parameters = new Array()

  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleGrantedEvent
}

export function createRoleRevokedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleRevoked {
  let roleRevokedEvent = changetype<RoleRevoked>(newMockEvent())

  roleRevokedEvent.parameters = new Array()

  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleRevokedEvent
}

export function createTransferBatchEvent(
  operator: Address,
  from: Address,
  to: Address,
  ids: Array<BigInt>,
  values: Array<BigInt>
): TransferBatch {
  let transferBatchEvent = changetype<TransferBatch>(newMockEvent())

  transferBatchEvent.parameters = new Array()

  transferBatchEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  transferBatchEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferBatchEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferBatchEvent.parameters.push(
    new ethereum.EventParam("ids", ethereum.Value.fromUnsignedBigIntArray(ids))
  )
  transferBatchEvent.parameters.push(
    new ethereum.EventParam(
      "values",
      ethereum.Value.fromUnsignedBigIntArray(values)
    )
  )

  return transferBatchEvent
}

export function createTransferSignatureValidEvent(
  signature: Bytes,
  payload: ethereum.Tuple
): TransferSignatureValid {
  let transferSignatureValidEvent = changetype<TransferSignatureValid>(
    newMockEvent()
  )

  transferSignatureValidEvent.parameters = new Array()

  transferSignatureValidEvent.parameters.push(
    new ethereum.EventParam("signature", ethereum.Value.fromBytes(signature))
  )
  transferSignatureValidEvent.parameters.push(
    new ethereum.EventParam("payload", ethereum.Value.fromTuple(payload))
  )

  return transferSignatureValidEvent
}

export function createTransferSingleEvent(
  operator: Address,
  from: Address,
  to: Address,
  id: BigInt,
  value: BigInt
): TransferSingle {
  let transferSingleEvent = changetype<TransferSingle>(newMockEvent())

  transferSingleEvent.parameters = new Array()

  transferSingleEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  transferSingleEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferSingleEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferSingleEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  transferSingleEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return transferSingleEvent
}

export function createURIEvent(value: string, id: BigInt): URI {
  let uriEvent = changetype<URI>(newMockEvent())

  uriEvent.parameters = new Array()

  uriEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromString(value))
  )
  uriEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )

  return uriEvent
}

export function createUnpausedEvent(account: Address): Unpaused {
  let unpausedEvent = changetype<Unpaused>(newMockEvent())

  unpausedEvent.parameters = new Array()

  unpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return unpausedEvent
}

export function createUpgradedEvent(implementation: Address): Upgraded {
  let upgradedEvent = changetype<Upgraded>(newMockEvent())

  upgradedEvent.parameters = new Array()

  upgradedEvent.parameters.push(
    new ethereum.EventParam(
      "implementation",
      ethereum.Value.fromAddress(implementation)
    )
  )

  return upgradedEvent
}

export function createVintageMitigationEstimateChangedEvent(
  tokenId: BigInt,
  newEstimate: BigInt,
  oldEstimate: BigInt,
  reason: i32
): VintageMitigationEstimateChanged {
  let vintageMitigationEstimateChangedEvent =
    changetype<VintageMitigationEstimateChanged>(newMockEvent())

  vintageMitigationEstimateChangedEvent.parameters = new Array()

  vintageMitigationEstimateChangedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  vintageMitigationEstimateChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newEstimate",
      ethereum.Value.fromUnsignedBigInt(newEstimate)
    )
  )
  vintageMitigationEstimateChangedEvent.parameters.push(
    new ethereum.EventParam(
      "oldEstimate",
      ethereum.Value.fromUnsignedBigInt(oldEstimate)
    )
  )
  vintageMitigationEstimateChangedEvent.parameters.push(
    new ethereum.EventParam(
      "reason",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(reason))
    )
  )

  return vintageMitigationEstimateChangedEvent
}
