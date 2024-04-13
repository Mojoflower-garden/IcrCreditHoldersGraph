import { Project } from "../generated/schema";
import { ProjectCreated as ProjectCreatedEvent } from "../generated/CarbonContractRegistry/CarbonContractRegistry";
import { ProjectContract as ProjectTemplate } from "../generated/templates";
import { createProjectCreated } from "./helpers/helper";
import { dataSource } from "@graphprotocol/graph-ts";

export function handleProjectCreated(event: ProjectCreatedEvent): void {
  let entity = new Project(event.params.projectAddress);
  entity.projectId = event.params.projectId;
  entity.projectAddress = event.params.projectAddress;
  entity.projectName = event.params.projectName;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  let context = dataSource.context();
  ProjectTemplate.createWithContext(event.params.projectAddress, context);
  entity.save();
  createProjectCreated(event, entity.id);
}
