var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');  
var app = express();

var jsonParser = bodyParser.json();

var options = {
  host: 'api.line.me',
  port: 443,
  path: '/v2/bot/message/reply',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer iRL/MaU55B0qwHs7bxqy2AXRZz4qj+20GnpJhDOsaur4aXhNdr2N3S5a/2b4D8m+bl04Y6kN45qDq5IrTHjEAUPiiXtNj4Tm/4AkzC7yNDEnFcvgCDxOQXpA+pmNmhAimkdgCpdExM9NoCffokrNqgdB04t89/1O/w1cDnyilFU='
  }
}
app.set('port', (process.env.PORT || 5000));

// views is directory for all template files

app.get('/', function(req, res) {
//  res.send(parseInput(req.query.input));
  res.send('Hello');
});

app.post('/', jsonParser, function(req, res) {
  let event = req.body.events[0];
  let type = event.type;
  let msgType = event.message.type;
  let msg = event.message.text;
  let rplyToken = event.replyToken;

  let rplyVal = null;
  console.log(msg);
  if (type == 'message' && msgType == 'text') {
    try {
      rplyVal = parseInput(rplyToken, msg); 
    } 
    catch(e) {
      //rplyVal = randomReply();
      console.log('總之先隨便擺個跑到這邊的訊息，catch error');
    }
  }

  if (rplyVal) {
    replyMsgToLine(rplyToken, rplyVal); 
  } else {
    console.log('Do not trigger'); 
  }

  res.send('ok');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function replyMsgToLine(rplyToken, rplyVal) {
  let rplyObj = {
    replyToken: rplyToken,
    messages: [
      {
        type: "text",
        text: rplyVal
      }
    ]
  }

  let rplyJson = JSON.stringify(rplyObj); 
  
  var request = https.request(options, function(response) {
    console.log('Status: ' + response.statusCode);
    console.log('Headers: ' + JSON.stringify(response.headers));
    response.setEncoding('utf8');
    response.on('data', function(body) {
      console.log(body); 
    });
  });
  request.on('error', function(e) {
    console.log('Request error: ' + e.message);
  })
  request.end(rplyJson);
}

function parseInput(rplyToken, inputStr) {
        console.log('InputStr: ' + inputStr);
        _isNaN = function(obj) {
         return isNaN(parseInt(obj));
        }                   

		if(inputStr.toLowerCase().match(/^kan/)!= null) return kan(inputStr.toLowerCase());
		//擲骰判定在此
		else if (inputStr.match(/\w/)!=null && inputStr.toLowerCase().match(/d/)!=null) {
          return nomalDiceRoller(inputStr);
        }
        else return undefined;
        
      }


        
function nomalDiceRoller(inputStr){
  
  //先定義要輸出的Str
  let finalStr = '' ;  
 //首先判斷是否是誤啟動（檢查是否有符合骰子格式）
  if (inputStr.toLowerCase().match(/\d+d\d+/) == null) return undefined;

  //再來先把第一個分段拆出來，待會判斷是否是複數擲骰
  let mutiOrNot = inputStr.toLowerCase().match(/\S+/);

  //排除小數點
  if (mutiOrNot.toString().match(/\./)!=null)return undefined;

  if(mutiOrNot.toString().match(/\D/)==null )  {
    finalStr= '複數擲骰：'
    if(mutiOrNot>20) return '不支援20次以上的複數擲骰。';

    for (i=1 ; i<=mutiOrNot ;i++){
      let DiceToRoll = inputStr.toLowerCase().split(' ',2)[1];
      if (DiceToRoll.match('d') == null) return undefined;
      finalStr = finalStr +'\n' + i + '# ' + DiceCal(DiceToRoll);
    }
    if(finalStr.match('200D')!= null) finalStr = '欸欸，不支援200D以上擲骰；哪個時候會骰到兩百次以上？想被淨灘嗎？';
    if(finalStr.match('D500')!= null) finalStr = '不支援D1和超過D500的擲骰；想被淨灘嗎？';
    
  } 
  
  else finalStr= '基本擲骰：' + DiceCal(mutiOrNot.toString());
  
  if (finalStr.match('NaN')!= null||finalStr.match('undefined')!= null) return undefined;
  return finalStr;
}
        
//作計算的函數
function DiceCal(inputStr){
  
  //首先判斷是否是誤啟動（檢查是否有符合骰子格式）
  if (inputStr.toLowerCase().match(/\d+d\d+/) == null) return undefined;
    
  //排除小數點
  if (inputStr.toString().match(/\./)!=null)return undefined;

  //先定義要輸出的Str
  let finalStr = '' ;  
  
  //一般單次擲骰
  let DiceToRoll = inputStr.toString().toLowerCase();  
  if (DiceToRoll.match('d') == null) return undefined;
  
  //寫出算式
  let equation = DiceToRoll;
  while(equation.match(/\d+d\d+/)!=null) {
    let tempMatch = equation.match(/\d+d\d+/);    
    if (tempMatch.toString().split('d')[0]>200) return '欸欸，不支援200D以上擲骰；哪個時候會骰到兩百次以上？想被淨灘嗎？';
    if (tempMatch.toString().split('d')[1]==1 || tempMatch.toString().split('d')[1]>500) return '不支援D1和超過D500的擲骰；想被淨灘嗎？';
    equation = equation.replace(/\d+d\d+/, RollDice(tempMatch));
  }
  
  //計算算式
  let answer = eval(equation.toString());
    finalStr= equation + ' = ' + answer;
  
  return finalStr;


}        

//用來把d給展開成算式的函數
function RollDice(inputStr){
  //先把inputStr變成字串（不知道為什麼非這樣不可）
  let comStr=inputStr.toString().toLowerCase();
  let finalStr = '(';

  for (let i = 1; i <= comStr.split('d')[0]; i++) {
    finalStr = finalStr + Dice(comStr.split('d')[1]) + '+';
     }

  finalStr = finalStr.substring(0, finalStr.length - 1) + ')';
  return finalStr;
}






//艦娘判定
function kan(inputStr)
{
	//事故表
	if (inputStr.toLowerCase().match('act') != null)
	{
		
		let rplyArr=['\事故表(1)：太好了！什麼都沒發生。',
		 '\事故表(2)→意外的反應。將該判定使用的個性的屬性(【長處】跟【弱點】顛倒過來。自己進行的判定以外時，無視此效果',
		 '\事故表(3)→咦...大失態！對該角色持有【感情值】的角色，全員的應援欄填入標記(チェック)。',
		 '\事故表(4)→被奇妙的貓附身。在周回(サイクル)或艦隊戰結束前，自己的行為判定受到－１的減值(此效果最多累積到－２減值)。',
		 '\事故表(5)→好痛！造成１個損傷。如果是在艦隊戰中，跟自己在同個航行序列的己方艦也受到１個損傷。',
		 '\事故表(6)→嗚嗚，過頭了！自己的【行動力】減少１Ｄ６點。'];
    return rplyArr[Math.floor((Math.random() * (rplyArr.length)) + 0)];	
	}
	//日常表
	else if(inputStr.toLowerCase().match('evnt') != null)
	{
	
		let rplyArr=[
		 '\日常表(2)→什麼都沒有的日子：「啊，好無聊！提督，做些什麼吧！」除了 （關鍵字） 之外，什麼都沒有的日子。提督選擇對應 （關鍵字） 的指定個性讓幕玩家的ＰＣ做判定。如果想不到就用 《待機／航海７》。\n達成： 幕玩家的ＰＣ，【行動力】回復到最大值。如果已經是最大值，這個集會期間，【行動力】的最大值＋２，現值也回復同值。\n殘念： 幕玩家的ＰＣ的【行動力】變成一半(小數進位)。',
		 '\日常表(3)→午茶時間：「Tea Time 也是很重要的—！」泡了紅茶，午茶時間。在高雅及良好的時光中渡過。幕玩家的ＰＣ進行 《國外生活／背景12》 判定。\n達成： 幕玩家的ＰＣ，【行動力】回復６點。幕中登場的其它玩家的ＰＣ，【行動力】回復２點。\n殘念： 全部ＰＣ的【行動力】減少２點，對幕玩家的ＰＣ的【感情值】有１點以上的全部角色，在聲援欄填入標記，以「感情表」隨機改變屬性(必為負向屬性)。',
		 '\日常表(4)→釣魚：「哇！大漁獲大漁獲！」學太公望放下釣線。嗯？釣到(關鍵字)了！提督選擇對應 （關鍵字） 的指定個性讓幕玩家的ＰＣ做判定。如果想不到就用 《大方／個性３》 。\n達成： 幕玩家獲得跟(關鍵字)相關的道具「回憶的物品」。\n殘念： 玩家的ＰＣ，【行動力】減少２點。鎮守府減少１Ｄ６的燃料。',
		 '\日常表(5)→午睡：「稍微，休息一下喔」在陽光下於鎮守府緩緩午睡著。好好的午睡，以準備決戰！幕玩家的ＰＣ進行 《睡覺／興趣２》 判定。\n達成： 全體ＰＣ移除一個損傷。\n殘念： 幕角色的ＰＣ，在這個周回的判定全部受到－１不利。',
		 '\日常表(6)→打掃乾淨吧：「好。乾淨俐落的整理吧。」艦內意外的凌亂。漂亮的清潔吧！說不定會找出什麼來。幕玩家的ＰＣ進行 《衛生／航海11》 判定。\n達成： 幕玩家的ＰＣ獲得１個隨機道具。殘念： 全體ＰＣ，失去一個自選道具。',
		 '\日常表(7)→海軍咖哩：「午餐的材料採購好了。洋蔥、馬鈴薯、胡蘿蔔、和...」借了廚房，幫大家料理。食譜是(關鍵字)風味海軍咖哩。唉呀，辣味的呢。提督選擇對應 （關鍵字） 的指定個性讓幕玩家的ＰＣ做判定。如果想不到就用 《食物／興趣６》 。\n達成： 全體ＰＣ的【行動力】回復１Ｄ６。\n殘念： 全體ＰＣ的【行動力】減少１Ｄ６。',
		 '\日常表(8)→銀蠅：「欸？沒、沒在喝喔？很清醒的啦～」銀繩在海軍俗語是指抓到偷吃。應該要好好的忍住，這是攸關規定。幕玩家的ＰＣ進行 《規律(規律)/航海５》 判定。\n達成： 幕玩家的ＰＣ，在這個集會期間，【行動力】的最大值＋２，現值也回復同值。\n殘念： 鎮守府的所有資材各減少３個。',
		 '\日常表(9)→每日的訓練：「只是為所當為而已，特別的評價這種……」認真的進行每日的訓練。《坦率／魅力２》 判定。\n達成： 幕玩家的ＰＣ獲得１０點經驗值。從幕玩家以外的ＰＣ中隨機挑選一人，對幕玩家的ＰＣ的【感情值】＋１。\n殘念： 全體ＰＣ的【行動力】減少１Ｄ６點。',
		 '\日常表(10)→採訪：「艦隊返航了呢，願意接受採訪嗎？」新聞局來採訪跟(關鍵字)相關的事情。寫篇好報導吧。提督選擇對應 （關鍵字） 的指定個性讓幕玩家的ＰＣ做判定。如果想不到就用 《名聲／背景３》 。\n達成： 對幕玩家的ＰＣ的【感情值】有１點以上的全部ＰＣ，對幕玩家的ＰＣ的【感情值】＋１。\n殘念： 對幕玩家的ＰＣ的【感情值】有１點以上的全部ＰＣ，對幕玩家的ＰＣ的聲援欄填上標記，以「感情表」隨機改變屬性(必為負向屬性)。',
		 '\日常表(11)→海水浴：「大海最棒了呢～大海！」鮮明的藍色海洋。實在很美，讓人忍不住跳進去。噗通！《突擊／戰鬥６》 判定。\n達成： 全體ＰＣ的【行動力】回復２點。幕玩家的ＰＣ獲得１個隨機道具。\n殘念： 幕玩家受到１點損傷，其它全部玩家的【行動力】減少２點。',
		 '\日常表(12)→My Boom：「飯真香！」自己的角色形象好有點隱薄......。決定了！利用(關鍵字)來確定新的角色形象！提督選擇對應 （關鍵字） 的指定個性讓幕玩家的ＰＣ做判定。如果想不到就用 《口癖／背景６》 。\n達成： 幕玩家的ＰＣ，在這次集會期間，進行跟(關鍵字)相關的扮演，或著在說話的語尾加上(關鍵字)，就能回復１點【行動力】。這個效果在鎮守府階段每個周回只能用１次，在艦隊戰中每一輪只能用１次。\n殘念： 其它所有玩家對幕玩家的ＰＣ的【感情值】減少１點。'];
		let value = eval(RollDice('2d6').toString());
		return rplyArr[eval(value)-2];	
	}
	//戰場表
	else if(inputStr.toLowerCase().match('snz') != null)
	{
		let rplyArr=[
		'戰場表(1) → 同航戰',
		'戰場表(2) → 反航戰，砲擊戰的第一回合跟第二回合採用相同的處理方式',
		'戰場表(3) → Ｔ字有利：全ＰＣ火力＋１',
		'戰場表(4) → Ｔ字不利：航空戰＼砲擊戰＼雷擊戰时，若存在相同航行序列的ＰＣ与ＮＰＣ，優先结算ＮＰＣ。',
		'戰場表(5) → 天候惡劣：艦載機的火力修正－１，『航空攻击』－１',
		'戰場表(6) → 海象惡劣：全ＰＣ回避－２',
		];
		return rplyArr[Math.floor((Math.random() * (rplyArr.length)) + 0)];	
	}
	//暴走表
	else if(inputStr.toLowerCase().match('rnt') != null)
	{
		
		let rplyArr=[
		'暴走表(1) → 妄想：腦中充滿著各種想像，無法集中注意力。幕結束時或回合結束時，【行動力】減少１點。',
		'暴走表(2) → 狂戰士：變的好戰，鬥爭本能完全裸露出來，即使受傷也不在意。需要消耗１Ｄ６【行動力】才能進行迴避判定。',
		'暴走表(3) → 興奮：興奮狀態，會過度出力。自己消費或減少【行動力】時，會多支付１點。',
		'暴走表(4) → 溺愛：除了某人以外的一切都不會進入視線，被對那個人的愛迷惑。只能對【感情值】最高的人聲援，若有複數，則無法對任何人聲援。',
		'暴走表(5) → 慢心：自視甚高，變的自己為了不起。進行行為判定時，２Ｄ６的數字在４以下就算大失誤。',
		'暴走表(6) → 絕望：完全失去希望，容易受到各種傷害自己受到傷害時，傷害＋１Ｄ６。',
		];
		return rplyArr[Math.floor((Math.random() * (rplyArr.length)) + 0)];	
	}
	else
		return undefined;
	
}



function Dice(diceSided){          
          return Math.floor((Math.random() * diceSided) + 1)
        }              


