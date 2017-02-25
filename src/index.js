import repl from 'repl';

import getStockHistoryService from './services/stock_history';

async function boot() {
  const stockHistory = await getStockHistoryService();

  startRepl({
    stockHistory,
  })
}

boot().catch(err => {
  console.error(err);
  process.exit(1);
});

function startRepl(context) {
  const replInstance = repl.start('StockGame > ');
  Object.assign(replInstance.context, context);
}