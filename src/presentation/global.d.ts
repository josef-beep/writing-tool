import type {UniverseBridge} from '../application/contracts/universe';
import type { WritingToolBridge } from '../application/contracts/readiness';
declare global { interface Window { writingTool: WritingToolBridge & UniverseBridge } }
