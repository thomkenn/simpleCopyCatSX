import { Environments, newSportX } from "@sportx-bet/sportx-js";
import {
  convertToAPIPercentageOdds,
  convertToTrueTokenAmount
} from "@sportx-bet/sportx-js";
const sportX = await newSportX(
Environments.SxMainnet,
"https://rpc.sx.technology/",
"privateKey",
undefined,
undefined,
undefined,
);

setTimeout(function(){ process.exit();}, 3000);

let market = process.argv[2];
let priceQuote = process.argv[3];
let side = process.argv[4];

checkifOrderExists(market, priceQuote, side);

async function checkifOrderExists(market, priceQuote, side){
	const orders = await sportX.getOrders([
	market,
	]);
	
	let noval = 0, yesval = 0, falsearr = [], truearr = [];
	for (inc in orders)
	{
		if (orders[inc].isMakerBettingOutcomeOne != side)//checks if theyre offering the side we want
		{
			let temp = parseInt(orders[inc].percentageOdds);
			
			temp = temp / 100000000000000000000;
			if (priceQuote >= (temp - 0.05) && priceQuote <= (temp + 0.05))//modify .05  for your tolerance level
			{
				fillTrade(orders[inc], side);//order on the book we want, gogogo
			}
		}
	}
}

async function fillTrade(ordertoFill)
{
	let baseToken = ordertoFill.baseToken;
	let betsize = 0;
	if (baseToken == "0xe2aa35C2039Bd0Ff196A6Ef99523CC0D3972ae3e")
		betsize = 50; //50 dollars
	else if (baseToken == "0xA173954Cc4b1810C0dBdb007522ADbC182DaB380")
		betsize = .05; //.05 eth
	else if (baseToken == "0xaa99bE3356a11eE92c3f099BD7a038399633566f")
		betsize = 500; //500 wsx
	betsize = convertToTrueTokenAmount(betsize, baseToken).toString();
	odds = parseFloat(((odds.toFixed(4)))*10000).toFixed(0) + "0000000000000000";

	const orders = [{
      executor: "0x9877d3Dd979e4804f7264237826080DE45499Ca8",
	  marketHash: ordertoFill.marketHash,
	  maker: ordertoFill.maker,
	  salt: ordertoFill.salt,
	  totalBetSize: ordertoFill.totalBetSize,
	  percentageOdds: ordertoFill.percentageOdds,
	  expiry: ordertoFill.expiry,
	  isMakerBettingOutcomeOne: ordertoFill.isMakerBettingOutcomeOne,
	  baseToken: baseToken,
	  signature: ordertoFill.signature,
	}];
	const fillAmounts = [
	  betsize
	];
	const result = await sportX.fillOrders(orders, fillAmounts);
	console.log(result)
}