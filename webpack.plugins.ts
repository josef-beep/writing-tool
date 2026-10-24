import type {Configuration} from 'webpack';

// ts-loader checks each compiler in process. A shared forked checker can outlive
// Forge's compiler and write to a closed worker pipe during shutdown.
export const plugins: Configuration['plugins'] = [];
