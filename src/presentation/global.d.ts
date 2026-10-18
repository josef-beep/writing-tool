import type {ProtectionBridge} from '../application/contracts/protection';
import type {PresentationBridge} from '../application/contracts/presentation';
import type {WorkspaceBridge} from '../application/contracts/workspace';
import type {ProjectBridge} from '../application/contracts/project';
import type {UniverseBridge} from '../application/contracts/universe';
import type { WritingToolBridge } from '../application/contracts/readiness';
declare global { interface Window { writingToolPresentation: PresentationBridge; writingTool: WritingToolBridge & UniverseBridge & ProjectBridge & WorkspaceBridge & ProtectionBridge } }
