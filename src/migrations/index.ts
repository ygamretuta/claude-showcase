import * as migration_20261013_033741_initial from './20261013_033741_initial';
import * as migration_20261013_043427_repository_activity from './20261013_043427_repository_activity';
import * as migration_20261013_080231_blob_object_key from './20261013_080231_blob_object_key';

export const migrations = [
  {
    up: migration_20261013_033741_initial.up,
    down: migration_20261013_033741_initial.down,
    name: '20261013_033741_initial',
  },
  {
    up: migration_20261013_043427_repository_activity.up,
    down: migration_20261013_043427_repository_activity.down,
    name: '20261013_043427_repository_activity',
  },
  {
    up: migration_20261013_080231_blob_object_key.up,
    down: migration_20261013_080231_blob_object_key.down,
    name: '20261013_080231_blob_object_key'
  },
];
