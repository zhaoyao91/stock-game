import dotenv from 'dotenv';

dotenv.config();

export default {
  mongodb: {
    url: process.env.MONGO_URL,
  },

  stockHistory: {
    endPoint: 'https://ali-stock.showapi.com/sz-sh-stock-history',
    apiCode: process.env.STOCKHISTORY_APICODE,
    maxStep: 31,
    veryBeginning: '2000-01-01',
  }
}