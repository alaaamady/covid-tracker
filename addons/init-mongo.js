function seed(dbName, user, password) {
  db = db.getSiblingDB(dbName);
  db.createUser({
    user: user,
    pwd: password,
    roles: [{ role: 'readWrite', db: dbName }],
  });

  db.createCollection('api_keys');

  db.api_keys.insert({
    key: 'GCMUDiuY5a7WvyUNt9n3QztToSHzK7Uj',
    permissions: ['GENERAL'],
    comments: ['To be used by the general user'],
    version: 1,
    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  db.users.insert({
    name: 'Admin',
    email: 'admin@xyz.com',
    password: '$2a$10$psWmSrmtyZYvtIt/FuJL1OLqsK3iR1fZz5.wUYFuSNkkt.EOX9mLa', // hash of password: changeit
    roles: db.roles
      .find({})
      .toArray()
      .map((role) => role._id),
    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

db.logs.insert([
  {
    userId: '90950108-bdbb-4ec7-b1df-9627d50ef422',
    temperature: 22,
    createdAt: '3/9/2023',
    location: { type: 'Point', coordinates: [77.5945627, 12.9715987] },
  },
  {
    userId: 'fbdde790-aacc-4b69-a537-387ce1f5c74f',
    temperature: 29,
    createdAt: '3/5/2023',
    location: {
      type: 'Point',
      coordinates: [-6.9596, 113.1965],
    },
  },
  {
    userId: 'fddead2f-fe27-460d-8b11-b2cd3c7c2e3a',
    temperature: 28,
    createdAt: '3/4/2023',
    location: {
      type: 'Point',
      coordinates: [25.941937, 117.365052],
    },
  },
]);

seed('covid-db', 'covid-db-user', 'changeit');
