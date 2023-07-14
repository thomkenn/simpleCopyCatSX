import * as ably from "ably";
import { XMLHttpRequest } from 'xmlhttprequest';
import { spawn } from 'child_process';

initialize()

async function initialize() {
  const realtime = new ably.Realtime.Promise({
    authUrl: `https://api.sx.bet/user/token`,
    authHeaders: {
      'x-api-key': 'your api key here',
    },
   });
  
  	const channel = realtime.channels.get(`recent_trades`);
	channel.subscribe((message) => {
		console.log(message.data);
	  if (message.data.bettor == "0x24357454D8d1a0Cc93a6C25fD490467372bC2454" && message.data.maker == false) //0x24357454D8d1a0Cc93a6C25fD490467372bC2454 danny, can replace with whatever wallet u want
	  {
		console.log("TAIL");
		console.log(message.data);
		
		/* //OPTIONAL: only tail if bigger then certain size (recommended)
		if (message.data.stake > 9999999999999999999)
		 {
		*/
		tryToTail(message.data.marketHash, message.data.odds, message.data.bettingOutcomeOne); //check if orders on the book, same price, then smash
		 //} 
	  }
	});
}

function tryToTail(market, odds, side) 
{
	var checkifSuccess = 0;
	var process = spawn('node',["checkthenBuyOrder.mjs", market, odds, side]);
	process.stdout.on('data', (data) => {
		console.log(data.toString());//see if we got a hit
	});
	process.stderr.on('data', (data) => {
		console.log(data.toString());//error if it doesnt work
	});
}