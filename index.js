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
		//艦娘擲骰
		if(inputStr.toLowerCase().match(/^kan/)!= null) return kan(inputStr.toLowerCase());
		//NC擲骰
		else if (inputStr.toLowerCase().match(/^\dnc/)!=null) return nc(inputStr.toLowerCase()); 
		else if (inputStr.toLowerCase().match(/^\dna/)!=null) return na(inputStr.toLowerCase());
		else if (inputStr.toLowerCase().match(/^snm/)!=null) return snm(inputStr.toLowerCase()); 
		else if (inputStr.toLowerCase().match(/^nnm/)!=null) return nnm(inputStr.toLowerCase()); 
		else if (inputStr.toLowerCase().match(/^enm/)!=null) return enm(inputStr.toLowerCase());
		//nc結束 其他功能開始
		else if(inputStr.toLowerCase().match(/^隨機/)!=null) return choice(inputStr.toLowerCase());
		else if(inputStr.toLowerCase().match(/^明日香/)!=null) return asuka(inputStr.toLowerCase());
		else if (inputStr.match(/運勢|運氣/)!=null) return luck();
		else if(inputStr.match(/^help/)!=null) return help();
		else if (inputStr.match(/\w/)!=null && inputStr.toLowerCase().match(/d/)!=null) {
          //擲骰判定
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
		 '\日常表(6)→打掃乾淨吧：「好。乾淨俐落的整理吧。」艦內意外的凌亂。漂亮的清潔吧！說不定會找出什麼來。幕玩家的ＰＣ進行 《衛生／航海11》 判定。\n達成： 幕玩家的ＰＣ獲得１個隨機道具。\n殘念： 全體ＰＣ，失去一個自選道具。',
		 '\日常表(7)→海軍咖哩：「午餐的材料採購好了。洋蔥、馬鈴薯、胡蘿蔔、和...」借了廚房，幫大家料理。食譜是(關鍵字)風味海軍咖哩。唉呀，辣味的呢。提督選擇對應 （關鍵字） 的指定個性讓幕玩家的ＰＣ做判定。如果想不到就用 《食物／興趣６》 。\n達成： 全體ＰＣ的【行動力】回復１Ｄ６。\n殘念： 全體ＰＣ的【行動力】減少１Ｄ６。',
		 '\日常表(8)→銀蠅：「欸？沒、沒在喝喔？很清醒的啦～」銀繩在海軍俗語是指抓到偷吃。應該要好好的忍住，這是攸關規定。幕玩家的ＰＣ進行 《規律(規律)/航海５》 判定。\n達成： 幕玩家的ＰＣ，在這個集會期間，【行動力】的最大值＋２，現值也回復同值。\n殘念： 鎮守府的所有資材各減少３個。',
		 '\日常表(9)→每日的訓練：「只是為所當為而已，特別的評價這種……」認真的進行每日的訓練。《坦率／魅力２》 判定。\n達成： 幕玩家的ＰＣ獲得１０點經驗值。從幕玩家以外的ＰＣ中隨機挑選一人，對幕玩家的ＰＣ的【感情值】＋１。\n殘念： 全體ＰＣ的【行動力】減少１Ｄ６點。',
		 '\日常表(10)→採訪：「艦隊返航了呢，願意接受採訪嗎？」新聞局來採訪跟(關鍵字)相關的事情。寫篇好報導吧。提督選擇對應 （關鍵字） 的指定個性讓幕玩家的ＰＣ做判定。如果想不到就用 《名聲／背景３》 。\n達成： 對幕玩家的ＰＣ的【感情值】有１點以上的全部ＰＣ，對幕玩家的ＰＣ的【感情值】＋１。\n殘念： 對幕玩家的ＰＣ的【感情值】有１點以上的全部ＰＣ，對幕玩家的ＰＣ的聲援欄填上標記，以「感情表」隨機改變屬性(必為負向屬性)。',
		 '\日常表(11)→海水浴：「大海最棒了呢～大海！」鮮明的藍色海洋。實在很美，讓人忍不住跳進去。噗通！《突擊／戰鬥６》 判定。\n達成： 全體ＰＣ的【行動力】回復２點。幕玩家的ＰＣ獲得１個隨機道具。\n殘念： 幕玩家受到１點損傷，其它全部玩家的【行動力】減少２點。',
		 '\日常表(12)→My Boom：「飯真香！」自己的角色形象好有點隱薄......。決定了！利用(關鍵字)來確定新的角色形象！提督選擇對應 （關鍵字） 的指定個性讓幕玩家的ＰＣ做判定。如果想不到就用 《口癖／背景６》 。\n達成： 幕玩家的ＰＣ，在這次集會期間，進行跟(關鍵字)相關的扮演，或著在說話的語尾加上(關鍵字)，就能回復１點【行動力】。這個效果在鎮守府階段每個周回只能用１次，在艦隊戰中每一輪只能用１次。\n殘念： 其它所有玩家對幕玩家的ＰＣ的【感情值】減少１點。'];
		let value = eval(RollDice('2d6').toString());
		return rplyArr[eval(value)-2];	
	}
	//交流表
	else if(inputStr.toLowerCase().match('evkt') != null)
	{
		let rplyArr=[
		'\交流表(2)→一觸即發的局勢：＂不要把我與五航戰相提並論。＂ 事情開始因為(關鍵字)而變得更糟了，如果繼續下去的話，有可能會影響到士氣。我們需要改變一下氣氛。提督選擇對應 （關鍵字） 的指定個性讓幕玩家的ＰＣ做判定。如果想不到就用《笑容／魅力７》\n達成：從幕玩家以外的ＰＣ中隨機挑選一人，對幕玩家的ＰＣ的【感情值】＋１。\n殘念：幕玩家失去３點行動力， 且對幕玩家的ＰＣ的【感情值】有１點以上的全部ＰＣ，對幕玩家的ＰＣ的聲援欄填上標記，以「感情表」隨機改變屬性(必為負向屬性)。',
		'\交流表(3)→手把手教導：＂這、這是什麼樣的任務？！＂只有你們兩人的秘密訓練。 幕玩家選擇另一位ＰＣ進行《Ｈ／魅力１１》的判定\n達成： 幕玩家與其選擇的ＰＣ將會失去他們所選的一個個性，並增加一個個性作為優點。 \n殘念： 對幕玩家的ＰＣ的【感情值】有１點以上的全部ＰＣ，對幕玩家的ＰＣ的聲援欄填上標記，以「感情表」隨機改變屬性(必為負向屬性)。',
		'\交流表(4)→愛是一場戰爭：＂我不會在愛情或戰爭中認輸的！＂一個艦娘出現在你面前，她似乎把你當成情敵了。＂我要求你(關鍵字)＂她表示。 提督選擇對應 （關鍵字） 的指定個性讓幕玩家的ＰＣ做判定。如果想不到就用《戀愛／興趣１２》\n達成：從幕玩家以外的ＰＣ中隨機挑選一人，對幕玩家的ＰＣ的【感情值】＋２。\n殘念：幕玩家失去２點行動力，並對其ＰＣ的聲援欄標記移除。',
		'\交流表(5)→按摩：＂恩...我感覺好很多了......謝謝你。＂當你被打倒時，沒有什麼能比過來場按摩更棒了，也許這能讓你振作起來？幕玩家選擇另一位ＰＣ進行《堅強／魅力６》的判定\n達成：被選擇的 ＰＣ對幕玩家的ＰＣ的【感情值】＋２，且幕玩家回復 【被選擇的ＰＣ的感情值Ｘ２】點行動值。\n殘念：幕玩家與被選擇的 ＰＣ各失去２點行動值，對幕玩家的ＰＣ的聲援欄填上標記，以「感情表」隨機改變屬性(必為負向屬性)。',
		'\交流表(6)→裸露的皮膚接觸：＂看看我漂亮的皮膚，你可以更靠近點喔！＂一起洗澡的話，當然是要坦誠相對，是吧？《入浴／興趣１１》判定\n達成：每個ＰＣ對幕玩家的ＰＣ【感情值】＋１\n殘念：每個玩家行動力－１， 且對幕玩家的ＰＣ的【感情值】有１點以上的全部ＰＣ，對幕玩家的ＰＣ的聲援欄填上標記，以「感情表」隨機改變屬性(必為負向屬性)。',
		'\交流表(7)→女孩的深夜對話：＂你這麼想跟我聊聊嗎？好吧，跟我來，看來我們要在一起​​一段時間了。＂你們在半夜裡聚在一起談論關於(關鍵字)的事情。. 提督選擇對應 （關鍵字） 的指定個性讓幕玩家的ＰＣ做判定。如果想不到就用《交談／興趣7》\n達成：每個ＰＣ對幕玩家的ＰＣ【感情值】＋１\n殘念：每個玩家失去１Ｄ６點行動力。',
		'\交流表(8)→念錯：＂你確定你沒有念錯任何東西嗎？＂你不小心念成了另一個編號，多麼尷尬阿！《笨蛋／魅力８》\n達成：每個ＰＣ對幕玩家的ＰＣ【感情值】＋１\n殘念：每個玩家行動力－１， 且對幕玩家的ＰＣ的【感情值】有１點以上的全部ＰＣ，對幕玩家的ＰＣ的聲援欄填上標記，以「感情表」隨機改變屬性(必為負向屬性)。',
		'\交流表(9)→堅強的愛：＂沒錯，你需要學會如何更相信我。＂內心撲撲直跳,，你鼓勵了一個優柔寡斷的同伴，這應該有助於她緩解心情。 幕玩家選擇另一位ＰＣ進行《母性／性格４》的判定\n達成：被選擇的 ＰＣ對幕玩家的ＰＣ的【感情值】＋２，且幕玩家回復 【被選擇的ＰＣ的感情值Ｘ２】點行動值。\n殘念：幕玩家與被選擇的 ＰＣ各失去１Ｄ６點行動值',
		'\交流表(10)→點心時間！：＂我以為我們有點心吃。＂當你們正在做巡邏任務時，有人帶了個(關鍵字)。幕玩家選擇另一位ＰＣ進行對應 （關鍵字） 的指定個性，如果想不到就用《穩重／魅力４》\n達成：被選擇的 ＰＣ對幕玩家的ＰＣ的【感情值】＋１，且被選擇的ＰＣ獲得與關鍵字有關的道具。\n殘念：鎮守府減少１Ｄ６的燃料。',
		'\交流表(11)→信：＂有你的一封信！＂當你不能直接的對話時，嘗試把你的想法寫在紙上，我希望我的感覺能傳達給她。幕玩家選擇另一位ＰＣ進行《古風／背景５》的判定\n達成：被選擇的 ＰＣ對幕玩家的ＰＣ的【感情值】＋２\n殘念：幕玩家的優點個性改為缺點。',
		'\交流表(12)→回憶：＂什、什麼？你為什麼不記得了。＂ 你們正在談論關於(關鍵字)的事，那是一段很艱苦的時段，也許不要去問比較好。幕玩家選擇另一位ＰＣ進行對應 （關鍵字） 的指定個性，如果想不到就用《黑歷史／背景４》\n達成：被選擇的 ＰＣ對幕玩家的ＰＣ的【感情值】＋１\n殘念： 每個玩家失去２點行動力， 且對幕玩家的ＰＣ的【感情值】有１點以上的全部ＰＣ，對幕玩家的ＰＣ的聲援欄填上標記，以「感情表」隨機改變屬性(必為負向屬性)。'	
		];
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
	//特殊戰果表
	else if(inputStr.toLowerCase().match('spsnt') != null)
	{
		let rplyArr=[
		'特殊戰果表(1) → 全資材各獲得３個。',
		'特殊戰果表(2) → 從「道具表」中隨意取得１個物品。',
		'特殊戰果表(3) → 獲得１枚家具幣',
		'特殊戰果表(4) → 不需要消費資材，使用１次「炮類開發表」。',
		'特殊戰果表(5) → 不需要消費資材，使用１次「艦載機開發表」。',
		'特殊戰果表(6) → 不需要消費資材，使用１次「特殊開發表」。',
		];
		return rplyArr[Math.floor((Math.random() * (rplyArr.length)) + 0)];	
	}
	//戰果表
	else if(inputStr.toLowerCase().match('snt') != null)
	{
		let rplyArr=[
		'戰果表(1) → 獲得[１Ｄ６＋敵艦隊人數]個燃料。',
		'戰果表(2) → 獲得[１Ｄ６＋敵艦隊人數]個彈藥。',
		'戰果表(3) → 獲得[１Ｄ６＋敵艦隊人數]個鋼材。',
		'戰果表(4) → 獲得[１Ｄ６＋敵艦隊人數]個鋁土。',
		'戰果表(5) → 獲得[１Ｄ６＋敵艦隊人數]個任意資材。',
		'戰果表(6) → 各自提升１點對任意角色的【感情值】。',
		];
		return rplyArr[Math.floor((Math.random() * (rplyArr.length)) + 0)];	
	}
	//普通開發表
	else if(inputStr.toLowerCase().match('dvt') != null)
	{
		let rplyArr = [
		'普通開發表(1) → 使用裝備１種表決定',
		'普通開發表(2) → 使用裝備１種表決定',
		'普通開發表(3) → 使用裝備２種表決定',
		'普通開發表(4) → 使用裝備２種表決定',
		'普通開發表(5) → 使用裝備３種表決定',
		'普通開發表(6) → 使用裝備４種表決定'
		];
		
		return rplyArr[Math.floor((Math.random() * (rplyArr.length)) + 0)];
	}
	//裝備1
	else if(inputStr.toLowerCase().match('wp1t') != null)
	{
		let rplyArr = [
		'装備１種表(1) → 小口径主砲（着任ノ書 P.249）',
		'装備１種表(2) → 10cm連装高角砲（着任ノ書 P.249）',
		'装備１種表(3) → 中口径主砲（着任ノ書 P.249）',
		'装備１種表(4) → 15.2cm連装砲（着任ノ書 P.249）',
		'装備１種表(5) → 20.3cm連装砲（着任ノ書 P.249）',
		'装備１種表(6) → 魚雷（着任ノ書 P.242）'
		];
		
		return rplyArr[Math.floor((Math.random() * (rplyArr.length)) + 0)];
	}
	//裝備2
	else if(inputStr.toLowerCase().match('wp2t') != null)
	{
		let rplyArr = [
		'裝備２種表(1) → 副砲（着任ノ書 P.250）',
		'裝備２種表(2) → 8cm高角砲（着任ノ書 P.250）',
		'裝備２種表(3) → 大口径主砲（着任ノ書 P.249）',
		'裝備２種表(4) → 41cm連装砲（着任ノ書 P.250）',
		'裝備２種表(5) → 46cm三連装砲（着任ノ書 P.250）',
		'裝備２種表(6) → 機銃（着任ノ書 P.252）'
		];
		
		return rplyArr[Math.floor((Math.random() * (rplyArr.length)) + 0)];
	}
	//裝備3
	else if(inputStr.toLowerCase().match('wp3t') != null)
	{
		let rplyArr = [
		'裝備３種表(1) → 艦上爆撃機 （着任ノ書 P.250）',
		'裝備３種表(2) → 艦上攻撃機（着任ノ書 P.251）',
		'裝備３種表(3) → 艦上戦闘機（着任ノ書 P.251）',
		'裝備３種表(4) → 偵察機（着任ノ書 P.251）',
		'裝備３種表(5) → 電探（着任ノ書 P.252）',
		'裝備３種表(6) → 25mm連装機銃（着任ノ書 P.252）'
		];
		
		return rplyArr[Math.floor((Math.random() * (rplyArr.length)) + 0)];
	}
	//裝備4
	else if(inputStr.toLowerCase().match('wp4t') != null)
	{
		let rplyArr = [
		'裝備４種表(1) → 彗星（着任ノ書 P.250）',
		'裝備４種表(2) → 天山（着任ノ書 P.251）',
		'裝備４種表(3) → 零式艦戦52型（着任ノ書 P.251）',
		'裝備４種表(4) → 彩雲（着任ノ書 P.251）',
		'裝備４種表(5) → 61cm四連装(酸素)魚雷（着任ノ書 P.252）',
		'裝備４種表(6) → 改良型艦本式タービン（着任ノ書 P.252）'
		];
		
		return rplyArr[Math.floor((Math.random() * (rplyArr.length)) + 0)];
	}
	//艦載機開發表
	else if(inputStr.toLowerCase().match('wpfa') != null)
	{
		let rplyArr = [
		'艦載機開發表(4) → 開發失敗。沒有得到裝備特能，資材浪費了',
		'艦載機開發表(5) → 開發失敗。沒有得到裝備特能，資材浪費了',
		'艦載機開發表(6) → 開發失敗。沒有得到裝備特能，資材浪費了',
		'艦載機開發表(7) → 開發失敗。沒有得到裝備特能，資材浪費了',
		'艦載機開發表(8) → 開發失敗。沒有得到裝備特能，資材浪費了',
		'艦載機開發表(9) → Ju87C改（建造ノ書 壱 P.167）',
		'艦載機開發表(10) → 流星（建造ノ書 壱 P.167）',
		'艦載機開發表(11) → 紫電改二（建造ノ書 壱 P.167）',
		'艦載機開發表(12) → 零式艦戦52型（着任ノ書 P.251）',
		'艦載機開發表(13) → 艦上戦闘機（着任ノ書 P.251）',
		'艦載機開發表(14) → 偵察機（着任ノ書 P.251）',
		'艦載機開發表(15) → 艦上爆撃機 （着任ノ書 P.250）',
		'艦載機開發表(16) → 艦上攻撃機（着任ノ書 P.251）',
		'艦載機開發表(17) → 彩雲（着任ノ書 P.251）',
		'艦載機開發表(18) → 彗星（着任ノ書 P.250）',
		'艦載機開發表(19) → 天山（着任ノ書 P.251）',
		'艦載機開發表(20) → 瑞雲（建造ノ書 壱 P.168）',
		'艦載機開發表(21) → 彗星一二型甲（建造ノ書 壱 P.167）',
		'艦載機開發表(22) → 流星改（建造ノ書 壱 P.167）',
		'艦載機開發表(23) → 烈風（建造ノ書 壱 P.168）',
		'艦載機開發表(24) → 零式水上観測機（建造ノ書 壱 P.168）'
		];
		
		let value = eval(RollDice('4d6').toString());
		return rplyArr[eval(value)-4];
	}
	//炮類開發表
	else if(inputStr.toLowerCase().match('wpcn') != null)
	{
		let rplyArr = [
		'炮類開發表(4) → 開發失敗。沒有得到裝備特能，資材浪費了',
		'炮類開發表(5) → 開發失敗。沒有得到裝備特能，資材浪費了',
		'炮類開發表(6) → 三式彈（建造ノ書 壱 P.169）',
		'炮類開發表(7) → 25mm連装機銃（着任ノ書 P.252）',
		'炮類開發表(8) → 41cm連装砲（着任ノ書 P.250）',
		'炮類開發表(9) → 8cm高角砲（着任ノ書 P.250）',
		'炮類開發表(10) → 15.2cm連装砲（着任ノ書 P.249）',
		'炮類開發表(11) → 魚雷（着任ノ書 P.242）',
		'炮類開發表(12) → 機銃（着任ノ書 P.252）',
		'炮類開發表(13) → 小口径主砲（着任ノ書 P.249）',
		'炮類開發表(14) → 中口径主砲（着任ノ書 P.249）',
		'炮類開發表(15) → 小口径主砲（着任ノ書 P.249）',
		'炮類開發表(16) → 中口径主砲（着任ノ書 P.249）',
		'炮類開發表(17) → 10cm連装高角砲（着任ノ書 P.249）',
		'炮類開發表(18) → 20.3cm連装砲（着任ノ書 P.249）',
		'炮類開發表(19) → 61cm四連装(酸素)魚雷（着任ノ書 P.252）',
		'炮類開發表(20) → 46cm三連装砲（着任ノ書 P.250）',
		'炮類開發表(21) → 15.5cm三連装砲(副砲)（建造ノ書 壱 P.167）',
		'炮類開發表(22) → 61cm五連装(酸素)魚雷（建造ノ書 壱 P.168）',
		'炮類開發表(23) → 53cm艦首(酸素)魚雷（建造ノ書 壱 P.168）',
		'炮類開發表(24) → 九一式徹甲弾（建造ノ書 壱 P.169）'
		];
		
		let value = eval(RollDice('4d6').toString());
		return rplyArr[eval(value)-4];
	}
	//特殊開發表
	else if(inputStr.toLowerCase().match('wpmc') != null)
	{
		let rplyArr = [
		'特殊開發表(2) → 開發失敗。沒有得到裝備特能，資材浪費了',
		'特殊開發表(3) → カ号観測機（建造ノ書 貳 P.171）',
		'特殊開發表(4) → 九三式水中聴音機（建造ノ書 貳 P.171）',
		'特殊開發表(5) → ドラム缶(輸送用)（建造ノ書 貳 P.171）',
		'特殊開發表(6) → 探照灯（建造ノ書 壱 P.169）',
		'特殊開發表(7) → 電探（着任ノ書 P.252）',
		'特殊開發表(8) → 改良型艦本式タービン（着任ノ書 P.252）',
		'特殊開發表(9) → 九四式爆雷投射機（建造ノ書 壱 P.169）',
		'特殊開發表(10) → 甲標的 甲（建造ノ書 壱 P.168）',
		'特殊開發表(11) → 33号対水上電探（建造ノ書 壱 P.169）',
		'特殊開發表(12) → 増設バルジ(中型艦)（建造ノ書 壱 P.169）',
		];
		
		let value = eval(RollDice('2d6').toString());
		return rplyArr[eval(value)-2];
	}
	//道具表
	else if (inputStr.toLowerCase().match('itt') !=null)
	{
		let rplyArr = [
		'道具表(1) → 冰淇淋：隨時都能當成輔助行動來使用。自己的【行動力】回復１Ｄ６點。',
		'道具表(2) → 羊羹：只可以在鎮守府階段中當作輔助行動。在艦隊戰中使用需要替代掉攻擊。選擇任一角色為目標，目標的【行動力】回復１Ｄ６點。在艦隊戰中使用時，只能選同航行序列的角色為目標。',
		'道具表(3) → 開發資材：只能在鎮守府階段當作輔助行動使用。進行一次開發。\n以這個效果進行的開發，如果對結果不滿意時，可以重新骰一次「開發表」。',
		'道具表(4) → 高速修復材：只能在要入渠時當作輔助行動使用。使用這個道具時，立刻進行入渠的損傷回復（原本是在幕結束時才進行）。此外，使用這個道具時，該幕不需要休息一次。',
		'道具表(5) → 應急修理專員：在自己被擊沉時當作輔助行動使用。自己受的損傷回復到只有３個。',
		'道具表(6) → 回憶的物品：任何時間都能當作輔助行動使用。選擇任一角色為目標。玩家要說出該道具與目標間回憶的內容，之後目標對自己ＰＣ的【感情值】上升１點。'
		];
		
		return rplyArr[Math.floor((Math.random() * (rplyArr.length)) + 0)];
	}
	//感情表
	else if (inputStr.toLowerCase().match('et') !=null)
	{
		let rplyArr = [
		'感情表(1) → 可愛(かわいい)／噁心(むかつく)',
		'感情表(2) → 厲害(すごい)／失望(ざんねん)',
		'感情表(3) → 愉快(たのしい)／恐怖(こわい)',
		'感情表(4) → 帥氣(かっこいい)／擔心(しんぱい)',
		'感情表(5) → 寵愛(いとしい)／想被注意(かまってほしい)',
		'感情表(6) → 最喜歡(だいすき)／最討厭(だいっきらい)'
		];
		
		return rplyArr[Math.floor((Math.random() * (rplyArr.length)) + 0)];
	}
	//大規模部隊表
	else if(inputStr.toLowerCase().match('lsft') != null)
	{
		let rplyArr = [
		'大規模部隊表(1) → 表情駭人的人型深海棲艦群。是敵方的『水上打擊部隊』。威脅力：10',
		'大規模部隊表(2) → 烏雲一般的艦載機成群出現。是敵方的『空母機動部隊』。威脅力：9',
		'大規模部隊表(3) → 黝黑的艦影發出令人膽寒的咆嘯。是敵方的『水雷戰隊』。威脅力：8',
		'大規模部隊表(4) → 無輪從哪個方向接近都會遭到雷擊。是敵方的『潛水艦部隊』。威脅力：7',
		'大規模部隊表(5) → 敵人多半是在運輸重要的資源。是敵方的『運輸部隊』。威脅力：6',
		'大規模部隊表(6) → 海面似乎也被染成漆黑一片，大事不妙。是敵方的『主力部隊』。威脅力：12'
		];
		
		return rplyArr[Math.floor((Math.random() * (rplyArr.length)) + 0)];
	}
	//勝利表
	else if(inputStr.toLowerCase().match('lfvt') != null)
	{
		let rplyArr = [
		'艦隊勝利表(1) → 支援砲擊！艦隊決戰開始時，選擇敵艦其中一人，受到一損傷',
		'艦隊勝利表(2) → 士氣高昂！艦隊決戰時，該ＰＣ的【命中力】＋１',
		'艦隊勝利表(3) → 士氣高昂！艦隊決戰時，該ＰＣ的【火力】＋１',
		'艦隊勝利表(4) → 士氣高昂！艦隊決戰時，該ＰＣ的【裝甲力】＋１',
		'艦隊勝利表(5) → 士氣高昂！艦隊決戰時，該ＰＣ的【迴避力】＋１',
		'艦隊勝利表(6) → 感情加深！伴隨艦對該ＰＣ的【感情值】＋１'
		];
		
		return rplyArr[Math.floor((Math.random() * (rplyArr.length)) + 0)];
	}
	//敗北表
	else if(inputStr.toLowerCase().match('lfdt') != null)
	{
		let rplyArr = [
		'艦隊敗北表(1) → 敵方支援砲擊！ＰＣ中隨機選擇一人，受到一損傷',
		'艦隊敗北表(2) → 中了敵人的詭計！ＰＣ中隨機選擇一人，骰一次『事故表』',
		'艦隊敗北表(3) → 被敵方艦隊追擊了！艦隊決戰時，戰場為『Ｔ字不利』',
		'艦隊敗北表(4) → 敵人與本隊合流。艦隊決戰開始時，若除了『主力部隊』外還有未被殲滅的部隊，則發生『敵方部隊支援』，艦隊決戰中，能用該部隊的編號，對ＰＣ的迴避進行判定妨礙',
		'艦隊敗北表(5) → 伴隨艦在作戰行動中失蹤。艦隊決戰開始時，敵方旗艦能從此伴隨艦習得的戰術能力與固有能力中，任選一項，視為在艦隊決戰中習得此能力',
		'艦隊敗北表(6) → 伴隨艦被轟沉。失去該伴隨艦，ＰＣ骰一次『暴走表』，附加暴走狀態'
		];
		
		return rplyArr[Math.floor((Math.random() * (rplyArr.length)) + 0)];
	}
	else if(inputStr.toLowerCase().match('help') != null)
	{
		let replStr ='';
		replStr +='各位艦娘跟提督們，歡迎使用明日香的指骰功能\n';
		replStr +='以下是支援的骰表\n';
		replStr +='請在前面加上 kan 進行艦娘rpg系統擲骰\n';
		replStr +='感情表：et\n';
		replStr +='事故表：act\n';
		replStr +='日常表：evnt\n';
		replStr +='交流表：evkt\n';
		replStr +='暴走表：rnt\n';
		replStr +='戰場表：snz\n';
		replStr +='戰果表：snt\n';
		replStr +='特殊戰果表：spsnt\n';
		replStr +='普通開發表：dvt\n';
		replStr +='装備１種表：wp1t\n';
		replStr +='装備２種表：wp2t\n';
		replStr +='装備３種表：wp3t\n';
		replStr +='装備４種表：wp4t\n';
		replStr +='炮類開發表：wpcn\n';
		replStr +='艦載機開發表：wpfa\n';
		replStr +='特殊開發表：wpmc\n';
		replStr +='道具表：itt\n';
		replStr += '大規模部隊表：lsft\n';
		replStr += '艦隊勝利表：lfvt\n';
		replStr += '艦隊敗北表：lfdt\n';
		return replStr;
	}
	else
		return undefined;
	
}
//NC擲骰
//行動判定
function nc(inputStr)
{
	let ncLine = inputStr.split(' ')[0];
	let line = ncLine.split('nc');
	if(line[0]>4)
	{
		return "行動判定加骰最多到4顆喔";
	}
	else
	{
		let diceArr = [];
		let resultArr = [];
		let correctionValue = 0;
		if(line[1]!='')
		{
			correctionValue = parseInt(line[1]);
			
		}
		for(let i = 0;i<line[0];i++)
		{
			diceArr[i] = Math.floor(Math.random()*10+1);
			resultArr[i] = diceArr[i] + correctionValue;
		}
		
		let replyStr = "[";
		replyStr += diceArr;
		replyStr += "]";
		replyStr += correctionValue;
		replyStr += "→ [";
		replyStr += resultArr;
		replyStr += "]→";
		if(parseInt(Math.max(...resultArr))>10) replyStr += "大成功";
		else if(parseInt(Math.max(...resultArr))>=6) replyStr += "成功";
		else if(parseInt(Math.min(...resultArr))<2) replyStr += "大失敗";
		else replyStr += "失敗";
		return replyStr;
	}
}
//命中判定
function na(inputStr)
{
	let naLine = inputStr.split(' ')[0];
	let line = naLine.split('na');
	if(line[0]>4)
	{
		return "行動判定加骰最多到4顆喔";
	}
	else
	{
		let diceArr = [];
		let resultArr = [];
		let correctionValue = 0;
		if(line[1]!='')
		{
			correctionValue = parseInt(line[1]);
			
		}
		for(let i = 0;i<line[0];i++)
		{
			diceArr[i] = Math.floor(Math.random()*10+1);
			resultArr[i] = diceArr[i] + correctionValue;
		}
		
		let replyStr = "[";
		replyStr += diceArr;
		replyStr += "]";
		replyStr += correctionValue;
		replyStr += "→ [";
		replyStr += resultArr;
		replyStr += "]→";
		if(parseInt(Math.max(...resultArr))>10)
		{
			replyStr += "攻擊大成功，由攻擊方決定命中部位，並增加";
			replyStr += (parseInt(Math.max(...resultArr))-10);
			replyStr += "點傷害";
		}
		else if(parseInt(Math.max(...resultArr))==10) replyStr += "攻擊成功，命中頭部";
		else if(parseInt(Math.max(...resultArr))==9) replyStr += "攻擊成功，命中手部";
		else if(parseInt(Math.max(...resultArr))==8) replyStr += "攻擊成功，命中驅幹";
		else if(parseInt(Math.max(...resultArr))==7) replyStr += "攻擊成功，命中足部";
		else if(parseInt(Math.max(...resultArr))==6) replyStr += "攻擊成功，由受攻擊者決定命中部位";
		else if(parseInt(Math.min(...resultArr))<2) replyStr += "大失敗，傷害轉嫁到範圍內友軍";
		else replyStr += "攻擊失敗";
		return replyStr;
	}
}
//依戀表

function snm()
{
	replyArr = [
		"01嫌惡\n濃濃的惡意。理由什麼的隨便找一個都好，總之就是看對方怎樣都不順眼。\n發狂：敵對認識\n「那種東西，壞掉了最好啦！」\n效果：戰鬥中，沒有命中敵方的攻擊，全部都會擊中嫌惡的對象。(如果有在射程內的話)",
		"02獨占\n對於對象抱有強烈的佔有慾。想要讓對方成為自己的東西，絕對不會讓給任何人。名為愛戀的邪惡慾望。\n發狂：獨占衝動\n「果然妳的眼睛，真的好漂亮。」\n效果：戰鬥開始與戰鬥結束，各別選擇損傷1個對象的部件。",
		"03依存\n對妳而言，那是不能沒有的存在。如果那個人不在的話，妳會無法承受。\n發狂：幼兒退行\n「別讓我一個人……不要這樣、好恐怖哦……」\n效果：妳的最大行動值減少2。",
		"04執著\n好想待在那個人的旁邊，不想離開。妳的容身之處就是在那個人的旁邊，不想離開、不會離開，直到永遠。\n發狂：跟蹤監視\\n效果：戰鬥開始與戰鬥結束時，對象對妳的依戀精神壓力點數各增加1點。(如果已經處在精神崩壞狀態，可以不用作此處理)",
		"05戀心\n只要想起那個人，心裡就充滿酸楚。不想被那個人討厭，請不要移開妳的視線，可是人家也好害羞……\n發狂：自傷行為\n「如果沒辦法讓那個人看上我的話，這樣的身體我也不需要……」\n效果：戰鬥開始與戰鬥結束時，各別選擇損傷1個自己的部件。",
		"06對抗\n就只有那個人，妳不能輸！也不是說妳討厭她什麼的，只是妳不想要輸。妳會跟她一直競爭下去。\n發狂：過度競爭\n「是我比較優秀！因為我很優秀所以我絕對比較優秀！我比妳還優秀啦！」\n效果：戰鬥開始與戰鬥結束時，各別選擇任意依戀，增加1點精神壓力點數。(如果已經處在精神崩壞狀態，可以不用作此處理)",
		"07友情\n在朋友當中，那個人是最重要的。如果是那個人的話，妳願意盡妳所能地，去幫助她，因為她是妳的摯友。\n發狂：共鳴依存\n「妳的腳沒了的呢？沒關係，我也拔掉我的腳吧！」\n效果：單元結束時，對象的損傷部件比妳還要多的時候，妳的部件損傷數，要增加到與對方相同。",
		"08保護\n那個孩子很弱小，如果妳不去看著她、不去幫助她的話，讓她獨自一人，妳辦不到。\n發狂：過度保護\n「不可以離開！因為妳是我要保護的！」\n效果：戰鬥當中，妳跟「依戀的對象」處於不同區域的時候，無法宣告「移動以外的戰鬥宣言」，此外妳沒有辦法把「自身」與「依戀對象」以外的單位當成移動對象。",
		"09憧憬\n好想變得跟她一樣。那是妳所憧憬的對象，是自己想要成為的理想樣貌的那個人。\n發狂：贗作妄想\n「騙人！姊姊大人才不會說出那樣的話來！妳一定是假的吧！我才不會被妳騙到！」\n效果：戰鬥當中，妳跟「依戀的對象」處於同樣區域的時候，無法宣告「移動以外的戰鬥宣言」，此外妳沒有辦法把「自身」與「依戀對象」以外的單位當成移動對象。",
		"10信賴\n妳與對方一心同體，是可以把妳的一切交給對方的存在。如果與那個人一同行動的話，那就沒有什麼好怕的。\n發狂：疑心暗鬼\n「……我過去的話，妳會從後面開槍吧。才不會讓妳得逞！」\n效果：除了妳以外的所有姊妹，最大行動值減少1。"
	];
	
	return replyArr[Math.floor((Math.random() * (replyArr.length)) + 0)];
}

function nnm()
{
	replyArr = [
		"01忌諱\n感覺好噁心，完全不想要靠近，更不用說肢體上的接觸了，甚至連視線也不想要對上。\n發狂：刻意迴避\n「別、別靠過來！不要靠近我！快給我滾開！」\n效果：妳與「依戀的對象」或者「僕從」在同一個區域的時候，無法宣告「具有移動以外效果的戰鬥宣言」。此外妳沒有辦法把「自身」與「依戀對象」與「僕從」以外的單位當成移動對象。",
		"02嫉妒\n妳的身體明明都傷成這樣了，為什麼她的身體卻是那麼地……為什麼？\n發狂：不和諧音\n「大家……大家都變得跟我一樣的話就好了……」\n效果：全體姊妹行動判定修正-1。",
		"03依存\n妳完全無法想像沒有那個人的世界，妳不想要離開、一刻也不想分開，想要一直、一直在一起……\n發狂：幼兒退行\n「不要離開我……求求妳、不要走……」\n效果：自身最大行動值-2。",
		"04憐憫\n為什麼那個孩子會變成這副德性？她到底經歷過怎樣的苦難？\n發狂：投入過剩\n「快點住手！為什麼、為什麼要、這麼做呢！？」\n效果：妳對「僕從」的攻擊判定修正值-1。",
		"05感謝\n你有著純然的感謝心情。妳能夠有著現在的心靈與身體，都是托了那個人的福。所以，不管自己會變成什麼樣子都……\n發狂：病態謝禮\n「至少請妳收下我的眼睛吧！多虧了妳，這雙眼睛看到了許多美好的事物。」\n效果：這個依戀發狂的時候，妳要選擇任意2個基本部件損傷，如果基本部件數目不夠損傷，則選擇一個等級最低的強化部件損傷。",
		"06悔恨\n讓那孩子變成這個樣子的，正是妳的傑作。這件事情，至今依然在妳的心中寢寤伴之。\n發狂：自暴自棄\n「啊啊，都是我的錯。因為我的關係，大家、大家都變成這個樣子了……！」\n效果：戰鬥中，妳所有失敗的攻擊判定都會打在自己身上，部位自選。",
		"07期待\n妳堅信著，那個人有著能夠將現狀，引導向光明未來的能力。絕對不會錯、絕對是這樣、絕對沒有問題、絕對……\n發狂：期望落空\n「我是這麼相信著妳啊！垃圾！廢物！屍渣！沒有用的東西！」\n效果：妳消耗精神壓力點數重骰的判定，修正值-1(這個效果會累積)。",
		"08保護\n需要妳守護的不只是姊妹，還有其他重要的……\n發狂：生前回歸\n「大家都活過來了……太好了……太好了……」\n效果：妳無法將「集團」當作目標。",
		"09尊敬\n妳很清楚，自己絕對沒有辦法像她那樣。不過正因為如此，那個人才是妳所嚮往的對象。\n發狂：神化崇拜\n「為了姊姊大人，我什麼都可以不要！」\n效果：妳無法將「其他姊妹」當作目標。",
		"10信賴\n她是妳打從心底信任，而且願意委以重任的人。即使世界都變成了完全不同的樣貌，妳對那個人的信賴也永遠不會變。\n發狂：疑神疑鬼\n「……反正妳就是敵人吧，少給我裝了！」\n效果：除了妳之外的所有姊妹最大行動值-1。"
	];
	return replyArr[Math.floor((Math.random() * (replyArr.length)) + 0)];
}
function enm()
{
	replyArr=[
		"01恐懼\n不可以去想、不可以思考，關於那個傢伙的事情，絕對、絕對不可以去碰觸，因為那個傢伙正是妳恐懼的根源。\n發狂：拒絕理解\n「那個是幻覺、一切都是假的，其實根本沒・有・任・何・人在那邊，所以沒關係……不怕、不怕……」\n效果：妳所有的行為判定、發狂判定全部修正-1。",
		"02隸屬\n在妳的心中，深深刻印著對那個傢伙的服從意識。有的時候，這樣的感覺會讓妳苦惱地不知所措。\n發狂：造反有理\\n效果：戰鬥中，妳所有攻擊判定的失敗都以大失敗論處。",
		"03焦慮\n從見面的那一刻起妳就知道，那個傢伙絕對握有什麼可怕的秘密存在，然後、那個秘密則是……\n「怎怎怎怎怎怎怎麼、可、可能……不對、不、這是騙、騙人的吧？」\n效果：妳的最大行動值減少2。",
		"04憐憫\n就算刻意去否認，妳的心中依然明白這個道理。站在妳們對面的並不是可恨的敵人，而是可憐的對手。\n發狂：斯德哥爾摩症候群\n「這也是沒有辦法的事情……畢竟妳也是不想要這樣的不是嗎……」\n效果：妳對「僕從」的攻擊判定修正-1。",
		"05愛恨\n明明應該是可恨的敵人，妳卻無法去恨她。那個傢伙的優點，妳全部都知道。\n發狂：殉情\n「我到底該怎麼辦？明明是那麼愛著妳的！可是我也不想看著妳就這樣死掉！」\n效果：妳的發狂判定、攻擊判定大成功的時候，自身選擇「判定值-10」個部件損壞。",
		"06悔恨\n妳正是讓那個傢伙，變成現在這樣的其中一個原因。對此，妳的心中充滿了抱歉與後悔。\n發狂：自暴自棄\n「對不起對不起對不起對不起對不起，如果我不在的話，如果我不在這個世界上的話就好了！」\n效果：戰鬥中，妳所有失敗的攻擊判定都會打在自己身上，部位自選。",
		"07輕視\n那個到底有什麼好的？不要說作為對手了，根本連注目都嫌浪費時間！\n發狂：目中無人\n「好了啦，在這裡磨磨蹭蹭的幹什麼？還不趕快走！」\n效果：戰鬥中，同區域的敵方單位對妳的攻擊判定修正+1。",
		"08憤怒\n無法抑制的憤怒渦流，將妳整個人給吞噬進去。把那個傢伙給打倒的聲音，在妳的心中不斷迴盪著。\n發狂：感情失控\n「…………！！！！」\n效果：妳的行為判定、發狂判定修正值-1。",
		"09怨恨\n只有那個渾蛋絕對不能原諒，不可以忘記，絕對要讓那個傢伙付出代價，絕對要報仇！\n發狂：不共戴天\n「以為死掉我就會放過妳嗎？少開玩笑啦！」\n效果：戰鬥當中，妳無法進行逃走判定。此外，妳的戰鬥動作的目標如果是「自身與此依戀的對象」之外的對象，該戰鬥動作要多消費1點行動值(這個增加的行動值消費無法被減輕)。",
		"10憎恨\n妳有著鋼鐵般沉著而堅定的憎恨，這樣的意志支持著妳的行動。為了將那個傢伙從這個世界上消去，妳抱著這樣的情感持續活動著。\n發狂：痕跡破壞\n「這是碰過那個傢伙的手嗎——讓我把它砍了吧！」\n效果：這個依戀發狂的時候，從其他姊妹當中選1人，該姊妹損傷任意2個部件。"
	];
	return replyArr[Math.floor((Math.random() * (replyArr.length)) + 0)];
}



//NC擲骰結束

function Dice(diceSided){          
          return Math.floor((Math.random() * diceSided) + 1)
        }              


function choice(inputStr)
{
	let itemArray = inputStr.split(' ');
	itemArray = itemArray.slice(1,itemArray.length);
	if(itemArray.length<2) return undefined;
	let replStr = '[';
	replStr +=itemArray +']→';
	replStr += itemArray[Math.floor((Math.random() * (itemArray.length)) + 0)];
	return replStr;
}
		
function asuka(inputStr)
{
	//愛麗絲
	if(inputStr.toLowerCase().match('愛麗絲') != null)
	{
		rplyArr = [
		"沒問題的，姊姊，我在這裡喔",
		"大家，打起精神來，在一起的話，就絕對沒問題的",
		"一點傷，沒什麼的，只要能保護姐姐們的話",
		"請給予大家希望吧，這是我唯一能幫得上忙的地方了",
		"姐姐們，不用擔心我，儘管發揮吧",
		"姐姐們，這裡就交給我吧",
		"別擔心的，我已經能照顧自己了",
		"雖然我的力量很小，但我也想幫上姐姐們的忙",
		"我是姐姐們的妹妹嘛，很幸福喔，就算在這個被毀滅的世界",
		"抱歉呢，沒能幫上忙，下次一定會更努力的"
		];
		return rplyArr[Math.floor((Math.random() * (rplyArr.length)) + 0)];
	}
	//狂人
	else if(inputStr.toLowerCase().match('狂人') != null)
	{
		rplyArr = [
		"哈！哈！哈！死吧，死吧",
		"還沒完、我還可以動、還不能結束！只要再一發、只要再一步！哪怕這副身軀毀壞殆盡，我也會動給你看！",
		"不對、不該是這樣！應該要、應該要這樣才對！",
		"都是你們的錯！不可原諒、不可原諒、完全不能原諒！把你們撕成碎片、給我化成灰吧！",
		"沒錯，這樣的世界，才是最適合我的，來吧，派對開始了",
		"下地獄吧，你們全部都給我下去",
		"不管怎麼樣都好，毀滅，將一切都毀滅",
		"沒錯，戰鬥，戰鬥，直到身體燃燒殆盡",
		"很痛嗎，很痛的對吧，這就是你最後的下場",
		"手臂掉了，正好減輕重量，腦袋被打下來，戰鬥時不需要複雜的思考，身體什麼的，之後再修復就好了"
		];
		return rplyArr[Math.floor((Math.random() * (rplyArr.length)) + 0)];
	}
	//自律人偶
	else if(inputStr.toLowerCase().match('自律人偶') != null)
	{
		rplyArr = [
		"沒關西的，一隻手而已，反正我已經死了嘛",
		"這裡交給我擋住，從旁邊攻擊",
		"只有現在，為了大家，請妳去死吧！",
		"沒問題的，我只是人偶，不會痛苦，不會恐懼的人偶",
		"舞動吧，只有死人的死亡舞蹈",
		"只是一隻腳而已，想要就拿去吧",
		"這種痛苦，就讓我一個人承受就好",
		"疼痛無法影響到我，我只是人偶，只是個會動的屍體而已",
		"就算身體被貫穿，也不能讓姊妹們受到傷害，我是屍體做成的盾",
		"只要再撐一下，就結束了，在那之前，必須忍耐才行"
		];
		return rplyArr[Math.floor((Math.random() * (rplyArr.length)) + 0)];
	}
	//廢棄品
	else if(inputStr.toLowerCase().match('廢棄品') != null)
	{
		rplyArr = [
		"去吧，我會跟上你的",
		"身體都變成這樣，再受點傷完全不是問題",
		"讓你看看吧，什麼是地獄的樣子",
		"這裡就由我來，讓他們看看我們的力量",
		"動起來吧，就算傷的再重，也不能放棄",
		"絕不會讓你破壞這裡，就算賭上我的性命",
		"腳斷了就用肩膀移動，手斷了就用牙齒攻擊，這種傷可不能阻擋我的怒火",
		"這裡就由我擋下，後方支援交給你們了",
		"這種東西，跟本無法傷到我",
		"戰鬥，戰場是我的舞台，如殺劇一般，將敵人斬裂"
		];
		return rplyArr[Math.floor((Math.random() * (rplyArr.length)) + 0)];
	}
	//幕僚
	else if(inputStr.toLowerCase().match('幕僚') != null)
	{
		rplyArr = [
		"敵人在2點鐘方向聚集，建議立刻擊退",
		"冷靜，冷靜，分析戰場，找到勝利的關鍵",
		"蹲下，快",
		"敵人的分佈是這樣嘛，那就從這裡進攻吧",
		"右邊的攻擊，然後是左方的踢擊，向後閃避子彈",
		"這種傷對我還說根本沒有影響，所有人照計畫進行",
		"給我好好待在後面，這樣的戰鬥你受不了的",
		"瞄準，射擊，後方支援就交給我了",
		"關鍵的一擊，就是現在，上吧",
		"要能幫助姊妹們，必須要能看清楚才行"
		];
		return rplyArr[Math.floor((Math.random() * (rplyArr.length)) + 0)];
	}
	//班長
	else if(inputStr.toLowerCase().match('班長') != null)
	{
		rplyArr = [
		"姊妹們，上吧，將敵人一口氣解決掉。",
		"沒問題的，不用擔心我，繼續攻擊",
		"這裡是我們的家，絕不會讓任何人破壞這裡的",
		"姊妹們，相信我吧，武們絕對能撐過去的，我向你們保證",
		"沒問題的，你比其他人都更堅強，是你帶給我們力量",
		"很痛苦吧，沒關係的，放下它吧，我會解收你的一切的，你也是我的妹妹阿",
		"不要說受傷甚麼的無所謂了！你是我的妹妹阿，之後，一切就交給我吧",
		"謝謝你們，我才能站在這裡，走吧，我們的旅程還沒結束",
		"這種事，對我來說小事一件，完全不是問題呢",
		"就是你嗎，打傷我的姊妹，我可不會輕饒你的"
		];
		return rplyArr[Math.floor((Math.random() * (rplyArr.length)) + 0)];
	}
	else
	{
		rplyArr = [
		"主人，我在這裡",
		"主人，請不要這樣",
		"主人，請不要隨便碰我",
		"主人，抱抱我",
		"來吧，決鬥，我的回合，抽牌",
		"主人，變態，請不要靠近我",
		"主人，請不要跟我講話",
		"主人，是蘿莉控嗎?",
		"主人，別擔心，我在這裡喔。",
		"主人，好乖好乖，不要哭嘛~",
		"主人，幫我撐個10秒",
		"你再說什麼啊~~~",
		"主人為什麼不注意我了呢，一定是那女人害的",
		"只要這樣，主人就會只關心我一個人了",
		"你的血是甚麼顏色的呢",
		"粗乃丸，快點粗乃丸",
		"限你們72小時內粗乃丸",
		"可愛的我現在出現在你的時間軸囉",
		"Cutely,lovely,shiny 魔法少女戰隊，隊長  明日香 參上",
		"歡迎回來，主人，要先吃飯嗎，還是要先洗澡呢，還是....."
		];
		return rplyArr[Math.floor((Math.random() * (rplyArr.length)) + 0)];	
		
	}
	
	
	
	
	
	
}

//運勢 運氣
function luck()
{
	replyArr =[
	"超幸運的一天，骰子女神眷顧你，骰10個大成功也不是夢呢",
	"大吉，超幸運的，絕對會成功的",
	"中吉，很不錯呢，事情會很順利的",
	"小吉，這是好機會，趁著勢頭往前吧",
	"半吉，加油，是表現的好機會",
	"末吉，雖然有著一些運氣，但不把握的話是沒辦法留住的呢。",
	"末小吉，很微妙的運氣呢，這時用實力證明自己吧",
	"凶，雖然事情可能會有些不順利，這時就用努力撐過去吧，明日香會在旁邊幫你加油的",
	"小凶，只要撐過這段時間，好運一定會降臨的，FIGHT！",
	"半凶，就算碰到不順利的事，也沒有人會怪你的喔，整頓好心情，邁向明天吧",
	"末凶，事情不會變得更糟了，抱著樂觀的心情上吧，想跟我傾訴也沒關西的喔",
	"大凶，這樣的運氣，就算連骰5個大失敗也有可能呢，啊！請不要靠近我，不然我也會變得不幸的",
	"恭喜，這裡是特別獎，可以得到明日香的摸摸頭一次呢(摸摸~摸摸",
	];
	let dice = Math.floor((Math.random()*1000+1));
	if (dice<=20) return replyArr[0];
	else if (dice<=90) return replyArr[1];
	else if (dice<=160) return replyArr[2];
	else if (dice<=250) return replyArr[3];
	else if (dice<=363) return replyArr[4];
	else if (dice<=444) return replyArr[5];
	else if (dice<=525) return replyArr[6];
	else if (dice<=600) return replyArr[7];
	else if (dice<=720) return replyArr[8];
	else if (dice<=825) return replyArr[9];
	else if (dice<=929) return replyArr[10];
	else if (dice<=989) return replyArr[11];
	else if (dice<=1000) return replyArr[12];
	else return undefined;
	
}

function help()
{

	let replyStr = '';
	replyStr += '大家好，我是人偶－明日香\n';
	replyStr += '請各位好好善待我喔\n';
	replyStr += '因為主人的技術還不純熟\n';
	replyStr += '所以明日香有很多事情還不會做\n';
	replyStr += '下面是明日香會做的事\n';
	replyStr += '想要知道艦娘rpg系統值骰指令 請打\"kan help\"\n';
	replyStr += '若想要跟我講講話，在一開始叫我的名字就好\n';
	replyStr += '在我名字後打上NC的傾向，會有別的對話喔，像是  明日香 愛麗絲 ，每個傾向共10句，全部共70句對話\n';
	replyStr += '隨機功能：在隨機後面打上要選擇的事物，例：隨機 1 2 3\n';
	replyStr += '運勢功能，啟動語 是\"運勢\"跟\"運氣\"\n';
	replyStr += '因為還是不完整的人偶，會有時停擺\n';
	replyStr += '這時有兩種可能，一個是主人正在增加我的機能\n';
	replyStr += '另一個是整個迴路停擺\n';
	replyStr += '總之，有問題的話請連絡我的主人:維維\n';
	replyStr += 'appiedavid777@gmail.com\n';
	return  replyStr;
}











