import { Resolvers, LaunchConnection, PatchSize, Launch } from './types';
const { paginateResults } = require('./utils');

export const resolvers: Resolvers = {
  Query: {
    launches: async (_, { pageSize = 20, after}, { dataSources }): Promise<LaunchConnection> => {
      const allLaunches = await dataSources.launchAPI.getAllLaunches();
      allLaunches.reverse();
      
      const launches = paginateResults({
        after,
        pageSize,
        results: allLaunches
      });

      return {
        launches,
        cursor: launches.length ? launches[launches.length - 1].cursor : null,
        hasMore: launches.length
          ? launches[launches.length - 1].cursor !==
            allLaunches[allLaunches.length - 1].cursor
          : false
      };
    },
    launch: (_, { id }, { dataSources }): Launch =>
      dataSources.launchAPI.getLaunchById({ launchId: id }),
    me: (_, __, { dataSources }) =>
      dataSources.userAPI.findOrCreateUser()
  },
  Mutation: {
    login: async (_, { email }, { dataSources }) => {
      const user = await dataSources.userAPI.findOrCreateUser({ email });
      if (user) {
        user.token = Buffer.from(email).toString('base64');
        return user;
      }
    },
    bookTrips: async (_, { launchIds }, { dataSources }) => {
      const results = await dataSources.userAPI.bookTrips({ launchIds });
      const launches = await dataSources.launchAPI.getLaunchesByIds({ launchIds });

      return {
        success: results && results.length === launchIds.length,
        message: results.length === launchIds.length
          ? 'trips booked successfully'
          : `the following launches couldn't be booked:${launchIds.filter(
            id => !results.includes(id),
          )}`,
        launches
      };
    },
    cancelTrip: async (_, { launchId }, { dataSources }) => {
      const result = await dataSources.userAPI.cancelTrip({ launchId });

      if (!result) {
        return {
          success: false,
          message: 'failed to cancel trip'
        }
      }

      const launch = await dataSources.launchAPI.getLaunchById({ launchId });
      return {
        success: true,
        message: 'trip cancelled',
        launches: [launch]
      };
    }
  },
  // 独自のresolverの設定
  Mission: {
    missionPatch: (mission, { size } = { size: PatchSize.Large }) => {
      return size === 'SMALL'
        ? PatchSize.Small
        : PatchSize.Large;
    }
  },
  Launch: {
    isBooked: async (launch, _, { dataSources }) =>
      dataSources.launchAPI.isBookedOnLaunch({ launchId: launch.id })
  },
  User: {
    trips: async (_, __, { dataSources }) => {
      const launchIds = await dataSources.userAPI.getLaunchByIdsByUser();
      if (!launchIds.length) return [];

      return (
        dataSources.launchAPI.getLaunchesByIds({
          launchIds
        }) || []
      );
    }
  }
}
