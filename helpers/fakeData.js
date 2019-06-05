const faker = require("faker");
const uuidv4 = require("uuid/v4");

//alter these values to generate different amounts of faked, seeded data
const userSeeds = 5;
const seriesSeeds = 20;
const memberSeeds = 500;
const messageSeeds = 20;
const classSeeds = 10;

module.exports = {
  createFakeUsers,
  createFakeTrainingSeries,
  createFakeClassMembers,
  createFakeMessages,
  createFakeClasses,
  createFakeOrganizations
};

function createFakeUsers() {
  const newAdminUsers = [];
  const newManagerUsers = [];
  const fakeUser = (type) => ({
    firstName: faker.name.findName(),
    lastName: faker.name.findName(),
    email: faker.internet.email(),
    notifications_sent: 0,
    country: type ? "" : faker.address.country(),
    is_admin: type,
    is_manager: type,
  });
  for (let i = 0; i < userSeeds; i++) {
    newAdminUsers.push(fakeUser(true));
  }
  for (let i = 0; i < userSeeds; i++) {
    newManagerUsers.push(fakeUser(false));
  }
  return [...newAdminUsers, ...newManagerUsers];
}
function createFakeClasses() {
  const newClasses = [];
  const fakeClasses = () => ({
    title: faker.commerce.department(),
    user_id: faker.random.number({ min: 1, max: classSeeds }),
  });
  for (let i = 0; i < classSeeds; i++) {
    newClasses.push(fakeClasses());
  }
  return newClasses;
}
function createFakeOrganizations() {
  const newOrganizations = [];
  const fakeClasses = () => ({
    name: faker.commerce.department(),
    user_id: faker.random.number({ min: 1, max: userSeeds }),
  });
  for (let i = 0; i < userSeeds; i++) {
    newOrganizations.push(fakeClasses());
  }
  return newOrganizations;
}

function createFakeTrainingSeries() {
  const newSeries = [];
  const fakeSeries = () => ({
    title: faker.company.catchPhrase(),
    country: faker.address.country(),
    user_id: faker.random.number({
      min: 1,
      max: userSeeds
    })
  });

  for (let i = 0; i < seriesSeeds; i++) {
    newSeries.push(fakeSeries());
  }

  return newSeries;
}

function createFakeClassMembers() {
  const newClassMembers = [];
  const fakeTeamMember = () => ({
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    phone_number: faker.phone.phoneNumber(),
    slack_uuid: uuidv4(),
    user_id: faker.random.number({ min: 1, max: userSeeds }),
    class_id: faker.random.number({ min: 1, max: classSeeds }),
  });
  for (let i = 0; i < memberSeeds; i++) {
    newClassMembers.push(fakeTeamMember());
  }

  return newClassMembers;
}

function createFakeMessages() {
  const newMessages = [];
  const fakeMessage = () => ({
    subject: faker.company.catchPhrase(),
    body: faker.company.bs(),
    link: faker.internet.url(),
    status: faker.random.number({min: 0, max: 2}),
    training_series_id: faker.random.number({
      min: 1,
      max: seriesSeeds
    }),
    for_manager: false,
    for_class: false,
    for_class_member: true,
    days_from_start: faker.random.number({ min: 1, max: 100 })
  });
  for (let i = 0; i < messageSeeds; i++) {
    newMessages.push(fakeMessage());
  }
  return newMessages;
}
