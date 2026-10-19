export type TheoryId = 'water' | 'sleep' | 'stroll' | 'veggie' | 'drama'

export interface Theory {
  id: TheoryId
  name: string
  short: string
  emoji: string
  tint: string
  task: string
  action: string
  doneLabel: string
  points: number
  success: string
  doctrine: string
  aside: string
}

export const THEORIES: readonly Theory[] = [
  {
    id: 'water',
    name: '大水理论',
    short: '大水',
    emoji: '💧',
    tint: '#d7f3ff',
    task: '灌完一瓶 ≥1.5L 大水',
    action: '已灌',
    doneLabel: '今日已灌',
    points: 2,
    success: '吨吨。宗门听见了。弱者喝饮料，强者喝大水。',
    doctrine:
      '水分是生命的溶剂，也是本宗唯一盖章的主流饮品。把 1.5 升举过头顶，你就暂时从饮料文明毕业。',
    aside: '不要问为什么是 1.5 升。问，就是宗门规定。',
  },
  {
    id: 'sleep',
    name: '大睡理论',
    short: '大睡',
    emoji: '😴',
    tint: '#ece4ff',
    task: '睡满宣称的 8 小时',
    action: '越睡越幸福',
    doneLabel: '幸福已结算',
    points: 1,
    success: '只有睡觉是越睡越幸福。闹钟的事，下辈子再说。',
    doctrine:
      '睡眠不是懒，是把人关机再开机。早起的人如果没喝大水，那叫假勤奋。被子是道场，枕头是法器。',
    aside: '躺下前把杯子放床头。醒来先吨一口，再决定要不要面对世界。',
  },
  {
    id: 'stroll',
    name: '大溜理论',
    short: '大溜',
    emoji: '🚶',
    tint: '#e5ffe9',
    task: '出门溜达 ≥20 分钟',
    action: '巡山完毕',
    doneLabel: '今日已溜',
    points: 1,
    success: '路都认你了。若有人看见你无声起舞，那是功法，不是中邪。',
    doctrine:
      '溜达不算运动 KPI，算宗门巡山。小区楼下、便利店门口、武康路，皆是道场。步数可以不要，风要。',
    aside: '把焦虑脸摘下来再出门。风会帮忙，路人不一定。',
  },
  {
    id: 'veggie',
    name: '大菜理论',
    short: '大菜',
    emoji: '🥬',
    tint: '#efffd4',
    task: '今天吃够膳食纤维',
    action: '我吃菜了',
    doneLabel: '叶子已入库',
    points: 1,
    success: '菜是固体的大水。恭喜你没有把空气当午餐。',
    doctrine:
      '膳食纤维是本宗唯一承认的固体大水。叶子算，奶茶不算，辣条不算，心情更不算。',
    aside: '吃菜的时候可以得意，但请不要教育同桌。',
  },
  {
    id: 'drama',
    name: '大红果理论',
    short: '大红果',
    emoji: '📺',
    tint: '#ffe4ec',
    task: '焦虑了就去看短剧',
    action: '文艺b已治疗',
    doneLabel: '短剧已给药',
    points: 1,
    success: '你这是典型的文艺b思维，焦虑都是短剧看少了。现在好点了吗。',
    doctrine:
      '情绪内耗太慢，短剧三分钟就反转。大红果一开，存在主义下班。这不叫逃避，叫快速结案。',
    aside: '看完记得喝水。屏幕很亮，但不能补水。',
  },
]

export interface TitleStep {
  min: number
  name: string
  line: string
}

export const TITLE_LADDER: readonly TitleStep[] = [
  { min: 0, name: '饮水门外汉', line: '杯子还是空的，但你已经站在门口了。' },
  { min: 3, name: '大水练习生', line: '吨吨有声，宗门开始记得你的名字。' },
  { min: 8, name: '吨吨执事', line: '你负责提醒别人：饮料是旁门。' },
  { min: 16, name: '大水长老', line: '说话前先喝一口，气场就稳了。' },
  { min: 28, name: '大水宗主', line: '全网进入大水时代，你坐主位。' },
]

export interface DerivedTheory {
  id: string
  name: string
  blurb: string
}

export const DERIVED: readonly DerivedTheory[] = [
  {
    id: 'stare',
    name: '大发呆理论',
    blurb: '弱者安排日程，强者对着窗户放空。发呆满十分钟，记一次小型顿悟。别发呆到忘了喝水，那叫脱水性哲学。',
  },
  {
    id: 'fish',
    name: '大摸鱼理论',
    blurb: '弱者表演忙碌，强者把鱼摸出花来。摸鱼时水杯必须在线，否则算旷工，不算修行。',
  },
  {
    id: 'flat',
    name: '大躺平理论',
    blurb: '躺平不是认输，是身体在投票。投票前把大水放在手能够到的地方，否则你只是一条口渴的水平线。',
  },
  {
    id: 'dance',
    name: '武康路无声舞理论',
    blurb: '耳机一戴，表情管理拉满，灵魂在人行道上偷偷营业。被看见也不要停，那是公开课。',
  },
  {
    id: 'reply',
    name: '大回消息理论',
    blurb: '弱者已读不回，强者回一个「嗯」，并附上今日饮水量。社交的本质，是报水位。',
  },
]

export const DAILY_QUOTES = [
  '弱者喝饮料，强者喝大水。',
  '全网进入大水时代。你要是不进来，就在门口吨一口。',
  '只有睡觉是越睡越幸福。',
  '你这是典型的文艺b思维，焦虑都是短剧看少了。',
  '爱自己的方式很多，今天先从灌水开始。',
  '溜达二十分钟，算巡山，不算运动焦虑。',
  '菜是固体大水。空气不是。',
]

export const ROASTS = [
  '功课还在杯子里晃，你人呢。',
  '今日理论尚未灌入体内。宗门理解，但不多。',
  '摆烂可以，请至少跟大水对视三秒。',
  '你不是失败，你是延迟开悟。',
  '焦虑去看短剧，渴了来找我。别两头空着。',
  '瓶子这么大，你这么空，画面不太和谐。',
]

export const TEA_LINES = [
  '雷达响了。甜的、汽的、功能的，都算饮料。',
  '本弹窗没有执法权，只有阴阳权。',
  '奶茶可以好喝，宗门可以不认。两件事同时成立。',
  '你手里那个杯子，正在把吨吨功力换成糖。',
  '这不是医学建议。这是宗门态度，而且态度很大。',
]

export const HIDDEN_CATALOG = [
  {
    id: 'traitor',
    name: '饮料宗叛徒',
    hint: '去偷喝一口，再选择「我就弱」',
  },
  {
    id: 'sleep',
    name: '大睡真神',
    hint: '大睡打卡累计 3 次',
  },
  {
    id: 'stroll',
    name: '武康路无声舞王',
    hint: '大溜打卡累计 3 次',
  },
  {
    id: 'drama',
    name: '短剧治愈师',
    hint: '大红果打卡累计 3 次',
  },
] as const
