const { getJestProjects } = require('@nx/jest');

module.exports = {
  projects: getJestProjects(),
  testEnvironment: 'jest-environment-jsdom',
};
