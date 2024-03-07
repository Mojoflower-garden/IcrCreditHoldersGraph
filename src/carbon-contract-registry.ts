import { Project } from "../generated/schema";
import { ProjectCreated as ProjectCreatedEvent } from "../generated/CarbonContractRegistry/CarbonContractRegistry";

import { ProjectContract as ProjectTemplate } from "../generated/templates";
import { createProjectCreated } from "./helpers/helper";

export function handleProjectCreated(event: ProjectCreatedEvent): void {
  let entity = new Project(event.params.projectAddress);
  entity.projectId = event.params.projectId;
  entity.projectAddress = event.params.projectAddress;
  entity.projectName = event.params.projectName;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  ProjectTemplate.create(event.params.projectAddress);
  entity.save();
  createProjectCreated(event, entity.id);
}
