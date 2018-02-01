require('dotenv').load()
// var WebClient = require('@slack/client').WebClient
// var web = new WebClient(process.env.SLACK_OAUTH)
var _ = require('lodash')

function getRandomUser (userList) {
  const randomIndex = Math.floor(Math.random() * userList.length)
  const user = userList[randomIndex]
  return user
}

function getRandomConvoName () {
  const adjectives = ['abundant', 'accessible', 'accurate', 'achievable', 'adaptable', 'adaptive', 'adequate', 'adjustable', 'admirable', 'admiring', 'adorable', 'adored', 'adoring', 'adroit', 'adulatory', 'advanced', 'affable', 'affluent', 'affordable', 'agile', 'agreeable', 'alluring', 'altruistic', 'amazed', 'amazing', 'ambitious', 'amenable', 'amiable', 'amicable', 'ample', 'amusing', 'angelic', 'appealing', 'ardent', 'articulate', 'artistic', 'assuring', 'astonished', 'astounded', 'astounding', 'athletic', 'attentive', 'attractive', 'audible', 'auspicious', 'authentic', 'autonomous', 'available', 'avid', 'awed', 'awesome', 'awestruck', 'balanced', 'beauteous', 'beautiful', 'believable', 'beloved', 'beneficent', 'beneficial', 'benevolent', 'best', 'best-known', 'better', 'blameless', 'blissful', 'blithe', 'bonny', 'booming', 'boundless', 'bountiful', 'brainiest', 'brainy', 'brand-new', 'brave', 'bright', 'brighter', 'brightest', 'brilliant', 'brisk', 'brotherly', 'bullish', 'buoyant', 'calm', 'calming', 'capable', 'carefree', 'catchy', 'celebrated', 'champion', 'charitable', 'charming', 'chaste', 'cheaper', 'cheapest', 'cheerful', 'cheery', 'cherished', 'chivalrous', 'classic', 'classy', 'clean', 'cleaner', 'cleanest', 'cleanly', 'clear', 'clear-cut', 'cleared', 'clearer', 'clever', 'coherent', 'cohesive', 'colorful', 'comely', 'comforting', 'comfy', 'commodious', 'compact', 'compatible', 'compliant', 'concise', 'confident', 'congenial', 'consistent', 'consummate', 'contrasty', 'convenient', 'convincing', 'cool', 'coolest', 'correct', 'courageous', 'courteous', 'courtly', 'cozy', 'creative', 'credible', 'crisp', 'crisper', 'cure-all', 'cushy', 'cute', 'daring', 'darling', 'dashing', 'dauntless', 'dazzled', 'dazzling', 'dead-cheap', 'dead-on', 'decent', 'decisive', 'dedicated', 'defeated', 'deft', 'delectable', 'delicate', 'delicious', 'delighted', 'delightful', 'dependable', 'deserving', 'desirable', 'desirous', 'detachable', 'devout', 'dexterous', 'dextrous', 'dignified', 'diligent', 'diplomatic', 'dirt-cheap', 'divine', 'dominated', 'durable', 'dynamic', 'eager', 'earnest', 'eased', 'easier', 'easiest', 'easy', 'easygoing', 'ebullient', 'economical', 'ecstatic', 'educated', 'effective', 'effectual', 'efficient', 'effortless', 'effusive', 'elated', 'elegant', 'elite', 'eloquent', 'eminent', 'enchanted', 'enchanting', 'endearing', 'endorsed', 'energetic', 'engaging', 'engrossing', 'enhanced', 'enjoyable', 'enough', 'enraptured', 'enthralled', 'enticing', 'entranced', 'entrancing', 'enviable', 'envious', 'equitable', 'err-free', 'erudite', 'ethical', 'euphoric', 'evaluative', 'eventful', 'evocative', 'exalted', 'exalting', 'exceeding', 'excellent', 'excited', 'exciting', 'exemplary', 'expansive', 'exquisite', 'exuberant', 'exultant', 'fabulous', 'fair', 'faithful', 'famed', 'famous', 'fancier', 'fancy', 'fantastic', 'fast', 'fast-paced', 'faster', 'fastest', 'faultless', 'favorable', 'favored', 'favorite', 'fearless', 'feasible', 'feisty', 'felicitous', 'fertile', 'fervent', 'fervid', 'festive', 'fiery', 'fine', 'finer', 'finest', 'firmer', 'first-rate', 'flashy', 'flatter', 'flattering', 'flawless', 'flexible', 'fluent', 'fond', 'foolproof', 'foremost', 'formidable', 'fortuitous', 'fortunate', 'fragrant', 'free', 'freed', 'fresh', 'fresher', 'freshest', 'friendly', 'frugal', 'fruitful', 'fun', 'funny', 'futuristic', 'gainful', 'gallant', 'galore', 'generous', 'genial', 'gentle', 'gentlest', 'genuine', 'gifted', 'glad', 'glamorous', 'gleeful', 'glimmering', 'glistening', 'glorious', 'glowing', 'god-given', 'godlike', 'gold', 'golden', 'good', 'goodly', 'gorgeous', 'graceful', 'gracious', 'grand', 'grateful', 'gratified', 'gratifying', 'great', 'greatest', 'guiltless', 'gutsy', 'halcyon', 'hale', 'hallowed', 'handier', 'hands-down', 'handsome', 'handy', 'happier', 'happy', 'hardier', 'hardy', 'harmless', 'harmonious', 'healthful', 'healthy', 'heartening', 'heartfelt', 'heavenly', 'helpful', 'heroic', 'hilarious', 'holy', 'honest', 'honorable', 'honored', 'hopeful', 'hospitable', 'hot', 'hottest', 'humane', 'humble', 'humorous', 'humourous', 'ideal', 'idolized', 'idyllic', 'immaculate', 'immense', 'impartial', 'impeccable', 'important', 'impressed', 'impressive', 'improved', 'improving', 'incredible', 'indebted', 'indulgent', 'infallible', 'ingenious', 'ingenuous', 'innocuous', 'innovative', 'insightful', 'inspiring', 'integral', 'integrated', 'intimate', 'intricate', 'intriguing', 'intuitive', 'invaluable', 'inventive', 'invincible', 'inviolable', 'inviolate', 'issue-free', 'jolly', 'jovial', 'joyful', 'joyous', 'jubilant', 'judicious', 'keen', 'kindly', 'laudable', 'lavish', 'lawful', 'leading', 'lean', 'legendary', 'lighter', 'likable', 'like', 'liked', 'lively', 'logical', 'lovable', 'loved', 'lovely', 'loving', 'low-cost', 'low-price', 'low-priced', 'low-risk', 'loyal', 'lucid', 'luckier', 'luckiest', 'lucky', 'lucrative', 'luminous', 'lush', 'lustrous', 'luxuriant', 'luxurious', 'luxury', 'lyrical', 'magic', 'magical', 'majestic', 'manageable', 'marvellous', 'marvelous', 'masterful', 'matchless', 'mature', 'meaningful', 'memorable', 'merciful', 'merry', 'mesmerized', 'meticulous', 'mighty', 'miraculous', 'modern', 'modest', 'momentous', 'monumental', 'motivated', 'navigable', 'neat', 'neatest', 'nice', 'nicer', 'nicest', 'nifty', 'nimble', 'noble', 'noiseless', 'noteworthy', 'nourishing', 'observant', 'obtainable', 'optimal', 'optimistic', 'opulent', 'orderly', 'organized', 'overjoyed', 'pain-free', 'painless', 'palatial', 'pampered', 'panoramic', 'paramount', 'passionate', 'patient', 'patri', 'otic', 'peaceable', 'peaceful', 'peerless', 'peppy', 'perfect', 'phenomenal', 'playful', 'pleasant', 'pleased', 'pleasing', 'plentiful', 'plush', 'poetic', 'poignant', 'poised', 'polished', 'polite', 'popular', 'portable', 'posh', 'positive', 'powerful', 'praising', 'precious', 'precise', 'preeminent', 'preferable', 'premier', 'pretty', 'priceless', 'principled', 'privileged', 'prize', 'proactive', 'prodigious', 'productive', 'proficient', 'profound', 'profuse', 'prolific', 'prominent', 'promised', 'promising', 'prompt', 'proper', 'propitious', 'prosperous', 'protective', 'proud', 'proven', 'prudent', 'punctual', 'pure', 'purposeful', 'quaint', 'qualified', 'quicker', 'quiet', 'quieter', 'radiant', 'rapid', 'rapt', 'rapturous', 'rational', 'reachable', 'readable', 'ready', 'realistic', 'realizable', 'reasonable', 'reasoned', 'receptive', 'redeeming', 'refined', 'reformed', 'refreshed', 'refreshing', 'regal', 'rejoicing', 'relaxed', 'reliable', 'remarkable', 'renewed', 'renowned', 'reputable', 'resilient', 'resolute', 'resounding', 'respectful', 'responsive', 'restful', 'restored', 'reverent', 'rewarding', 'rich', 'richer', 'right', 'righteous', 'rightful', 'risk-free', 'robust', 'rock-star', 'romantic', 'roomier', 'roomy', 'rosy', 'safe', 'saintly', 'salutary', 'sane', 'satisfied', 'satisfying', 'scenic', 'seamless', 'seasoned', 'secure', 'selective', 'sensible', 'sensitive', 'serene', 'sexy', 'sharp', 'sharper', 'sharpest', 'shiny', 'silent', 'simpler', 'simplest', 'simplified', 'sincere', 'skilled', 'skillful', 'sleek', 'slick', 'smart', 'smarter', 'smartest', 'smiling', 'smitten', 'smooth', 'smoother', 'smoothest', 'snappy', 'snazzy', 'sociable', 'soft', 'softer', 'solicitous', 'solid', 'soulful', 'spacious', 'sparkling', 'speedy', 'spellbound', 'spirited', 'spiritual', 'splendid', 'sporty', 'spotless', 'sprightly', 'stable', 'stainless', 'stately', 'statuesque', 'staunch', 'steadfast', 'steadiest', 'steady', 'stellar', 'striking', 'strong', 'stronger', 'strongest', 'stunned', 'stunning', 'stupendous', 'sturdier', 'sturdy', 'stylish', 'stylized', 'suave', 'sublime', 'subsidized', 'succeeding', 'successful', 'sufficient', 'suitable', 'sumptuous', 'super', 'superb', 'superior', 'supple', 'supported', 'supporting', 'supportive', 'supreme', 'surreal', 'swank', 'swankier', 'swankiest', 'swanky', 'sweeping', 'sweet', 'sweetheart', 'swift', 'talented', 'tempting', 'tenacious', 'tender', 'terrific', 'thankful', 'thinner', 'thoughtful', 'thrifty', 'thrilled', 'thrilling', 'thriving', 'thumb-up', 'thumbs-up', 'tidy', 'timely', 'tolerable', 'toll-free', 'top', 'top-notch', 'topnotch', 'tops', 'tough', 'tougher', 'toughest', 'tranquil', 'trendy', 'triumphal', 'triumphant', 'trusted', 'trusting', 'trusty', 'truthful', 'twinkly', 'unabashed', 'unaffected', 'unbeatable', 'unbiased', 'unbound', 'undamaged', 'undaunted', 'undisputed', 'unfettered', 'unlimited', 'unmatched', 'unreal', 'unrivaled', 'unselfish', 'unwavering', 'upbeat', 'upscale', 'usable', 'useable', 'useful', 'valiant', 'valuable', 'verifiable', 'veritable', 'versatile', 'vibrant', 'victorious', 'viewable', 'vigilant', 'virtuous', 'visionary', 'vivacious', 'vivid', 'warm', 'warmer', 'wealthy', 'welcome', 'well', 'well-being', 'well-bred', 'well-known', 'well-made', 'well-run', 'wholesome', 'wieldy', 'willing', 'winning', 'wise', 'witty', 'won', 'wonderful', 'wondrous', 'workable', 'worth', 'worthwhile', 'worthy', 'young', 'youthful', 'zippy', 'autumn', 'hidden', 'bitter', 'misty', 'empty', 'dry', 'dark', 'summer', 'icy', 'white', 'spring', 'winter', 'twilight', 'dawn', 'crimson', 'wispy', 'weathered', 'blue', 'billowing', 'broken', 'cold', 'damp', 'falling', 'frosty', 'green', 'long', 'late', 'lingering', 'bold', 'little', 'morning', 'muddy', 'old', 'red', 'rough', 'still', 'small', 'throbbing', 'shy', 'wandering', 'withered', 'wild', 'black', 'solitary', 'aged', 'snowy', 'floral', 'restless', 'ancient', 'purple', 'nameless']

  const nouns = [
    'waterfall', 'river', 'breeze', 'moon', 'rain', 'wind', 'sea', 'morning',
    'snow', 'lake', 'sunset', 'pine', 'shadow', 'leaf', 'dawn', 'glitter',
    'forest', 'hill', 'cloud', 'meadow', 'sun', 'glade', 'bird', 'brook',
    'butterfly', 'bush', 'dew', 'dust', 'field', 'fire', 'flower', 'firefly',
    'feather', 'grass', 'haze', 'mountain', 'night', 'pond', 'darkness',
    'snowflake', 'silence', 'sound', 'sky', 'shape', 'surf', 'thunder',
    'violet', 'water', 'wildflower', 'wave', 'water', 'resonance', 'sun',
    'wood', 'dream', 'cherry', 'tree', 'fog', 'frost', 'voice', 'paper',
    'frog', 'smoke', 'star'
  ]

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]

  return `${adjective}-${noun}`
}

function matchUsers (user, userList, db) {
  let matches = []

  if (userList.length > 1) {
    let user1 = user
    console.log(user1 + "type of user 1")
    let user2 = getRandomUser(userList)

    while (user2.id === user1) user2 = getRandomUser(userList)
    const match = [user1, user2.id]
    matches.push(match)

    userList.splice(_.findIndex(userList, (u) => u.id === user1.id), 1)
    userList.splice(_.findIndex(userList, (u) => u.id === user2.id), 1)

    const channelName = getRandomConvoName()
    console.log(channelName, match)
    // web.groups.create(channelName, (err, res) => {
    //   if (err) console.log('error creating group: ', err)
    //   console.log('Success!', res)
    // })

    // introduce match

    // - confirm not previously matched
    // - add match data to Firebase
  }

  return matches

  // if (previouslyMatched(match)) return getRandomMatch(userList)
  // else{
  // let user1data = user1.map((userId) => {
  //   return {
  //     [userId]: {
  //       skills: getSkills(userId, db),
  //       classes: getClasses(userId, db)
  //     }
  //   }
  // })
  // let user2data = user2.map((userId) => {
  //   return {
  //     [userId]: {
  //       skills: getSkills(userId, db),
  //       classes: getClasses(userId, db)
  //     }
  //   }
  // })
}

module.exports = {
  matchUsers: matchUsers
}
