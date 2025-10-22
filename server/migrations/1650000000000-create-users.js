/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('users', {
    id: 'id',
    name: { type: 'varchar(255)', notNull: true },
    email: { type: 'varchar(255)', notNull: true, unique: true },
    password_hash: { type: 'varchar(255)', notNull: true },
    role: { type: 'varchar(20)', notNull: true },
    parent_id: { type: 'integer', references: 'users', onDelete: 'SET NULL' },
    avatar: { type: 'varchar(50)', default: 'robot1' },
    created_at: { type: 'timestamp', default: pgm.func('CURRENT_TIMESTAMP') },
    updated_at: { type: 'timestamp', default: pgm.func('CURRENT_TIMESTAMP') }
  });
  pgm.createIndex('users', 'email', { ifNotExists: true });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};
