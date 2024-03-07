import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { AdminBurn } from "../generated/schema"
import { AdminBurn as AdminBurnEvent } from "../generated/Contract/Contract"
import { handleAdminBurn } from "../src/contract"
import { createAdminBurnEvent } from "./contract-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let from = Address.fromString("0x0000000000000000000000000000000000000001")
    let tokenId = BigInt.fromI32(234)
    let amount = BigInt.fromI32(234)
    let reason = 123
    let newAdminBurnEvent = createAdminBurnEvent(from, tokenId, amount, reason)
    handleAdminBurn(newAdminBurnEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AdminBurn created and stored", () => {
    assert.entityCount("AdminBurn", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AdminBurn",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "from",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AdminBurn",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokenId",
      "234"
    )
    assert.fieldEquals(
      "AdminBurn",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amount",
      "234"
    )
    assert.fieldEquals(
      "AdminBurn",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "reason",
      "123"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
