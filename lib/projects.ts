export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  description: string;
  challenge: string;
  solution: string;
  deliverables: string[];
  coverImage?: string;
  videoUrl?: string;
  images?: string[];
  designerCredit?: string;
  designerCreditLabel?: string;
  tags: string[];
  featured: boolean;
  color: string;
}

export const projects: Project[] = [
  {
    slug: "shapira-beer",
    title: "שפירא בירה",
    subtitle: "שפה מקומית לבירה מקומית",
    category: "מיתוג מילולי",
    year: "2024",
    description: "פיתוח אסטרטגיית מיתוג מילולי מלאה לבית בירה בוטיק ישראלי — מהסלוגן ועד לטון הדיבור.",
    challenge: "שפירא ידעו מה הם רוצים לאמר, אבל לא ידעו איך. נדרשה שפה שתרגיש אמיתית ומקומית בלי ליפול לקלישאות.",
    solution: "פיתחתי סלוגן ומדריך טון דיבור שמשלב אירוניה עדינה עם גאווה מקומית אמיתית. כל מילה נבחרה כמו קפה.",
    deliverables: ["סלוגן", "מדריך טון דיבור", "כותרות לאתר", "תוכן לרשתות חברתיות"],
    tags: ["מיתוג", "F&B", "טון דיבור", "סלוגן"],
    featured: true,
    color: "#2d3a2e"
  },
  {
    slug: "urban-wise",
    title: "Urban Wise",
    subtitle: "שם ושפה לייעוץ בנייה עירוני",
    category: "שיום + קופי",
    year: "2024",
    description: "שיום, פיתוח סלוגן וכתיבת תוכן אתר עבור חברת ייעוץ בתחום פינוי-בינוי ותמ\"א 38.",
    challenge: "שוק רווי בשמות גנריים. הלקוח היה מומחה אמיתי שנראה בדיוק כמו כולם.",
    solution: "שם דו-לשוני שמציב את החברה כגשר בין הידע המקצועי לעולם התושב — בלי לנסות להיות חכמה יותר מדי.",
    deliverables: ["שיום", "סלוגן", "אסטרטגיית מיתוג", "תוכן אתר"],
    tags: ["שיום", "נדל\"ן", "קופי", "אסטרטגיה"],
    featured: true,
    color: "#4a3728"
  },
  {
    slug: "hapsgah",
    title: "הפסגה",
    subtitle: "שפת תוכן לפלטפורמת נופש",
    category: "אסטרטגיית תוכן",
    year: "2023",
    description: "אסטרטגיית מדיה חברתית וסגנון כתיבה עבור פלטפורמת נופש ישראלית — בעברית שמרגישה כמו שיחה.",
    challenge: "הפלטפורמה פנתה לישראלים אבל דיברה בשפה שיווקית גנרית. הפער בין הטון לקהל היה רחוק.",
    solution: "בניתי מדריך סגנון שלם בעברית ישראלית טבעית — עם דוגמאות, אסורים, ומותרים. גם פיתחתי 30 פוסטים ראשונים.",
    deliverables: ["מדריך קול המותג", "אסטרטגיית תוכן", "30 פוסטים מוכנים", "מדריך נושאים"],
    tags: ["תוכן", "מדיה חברתית", "טיפוח", "אסטרטגיה"],
    featured: true,
    color: "#1a3a4a"
  },
  {
    slug: "snug",
    title: "SNUG",
    subtitle: "קופי לקולקציית Cold Self-Care",
    category: "קופי",
    year: "2024",
    description: "כתיבת קמפיין ותוכן מכירות לקולקציית חורף של מותג שייפוויר ישראלי.",
    challenge: "SNUG ידעו שהן טובות. הן פשוט לא ידעו לגרום לאחרות להרגיש את זה.",
    solution: "קמפיין Cold Self-Care שהפך את הפונקציה (חמימות) לרגש (בחירה עצמית). קופי שלא מוכר — מדבר.",
    deliverables: ["קמפיין", "דפי מוצר", "מיילים", "תוכן אינסטגרם"],
    tags: ["קופי", "אופנה", "E-commerce", "קמפיין"],
    featured: false,
    color: "#3a2d3a"
  },
  {
    slug: "reverie",
    title: "Rêverie",
    subtitle: "ניימינג | טאגליין",
    category: "ניימינג | טאגליין",
    year: "2024",
    description: "הנה וידוי - שוקולד זה הגילטי פלז'ר שלי. היה לי ברור שמתישהו תגיע לפתחי הזדמנות לעבוד עם מותג שוקולד (ואם לא, הייתי דפנטלי מביאה אותה בעצמי).\n\nהשוקולטיירית ריקי דדיה, הגיעה אליי תחת השם \"ריקולטה\" והרגישה שהוא כבר לא מדויק לה. אחרי שנים של למידה בחו\"ל ויצירת שוקולד שהוא אמנות בפני עצמה, היא הרגישה שהיא צריכה לרענן את המותג ולצאת לאור עם שם יותר מייצג.\n\nריקי סיפרה לי שהיא מושפעת מאוד מתרבות השוקולד הצרפתית, ושסגנון היצירה שלה מאפיין מאוד את אירופה - הצבעוניות העזה של הפרלינים, הדיוק האמנותי וכמובן חומרי הגלם האיכותיים ביותר - כולם לקוחים מיבשת אחרת.\n\nוכך גם אני יצאתי לחיפוש אחרי שם שיישמע קצת אחר, ויעטוף את המותג בסאונד ובמשמעות שמגיעה לו.",
    challenge: "",
    solution: "כך נולד Rêverie.\n\nהמשמעות של \"Rêverie\" בצרפתית היא חלום בהקיץ. ומה גורם לנו לאסקפיזם רגעי ומתוק יותר משוקולד — לא משנה אם זה באמצע יום עבודה, בנפילת סוכר של אחה\"צ או כפינוק בוקר מושלם ליד הקפה - הרגעים האלה שבהם השוקולד פוגש את בלוטות הטעם הם חלום מתוק. חלום בהקיץ.",
    deliverables: ["שיום", "טאגליין"],
    videoUrl: "/projects/reverie/Reverie banner 2500.mp4",
    images: [
      "/projects/reverie/Reverie-01.jpg",
      "/projects/reverie/Reverie-02.jpg",
      "/projects/reverie/Reverie-03.jpg",
      "/projects/reverie/Reverie-04.jpg",
      "/projects/reverie/Reverie-05.jpg",
      "/projects/reverie/Reverie-06.jpg",
    ],
    designerCredit: "Hadar Mizrahi",
    designerCreditLabel: "מיתוג ועיצוב",
    tags: ["ניימינג", "לוקסוס", "F&B", "שוקולד"],
    featured: false,
    color: "#c9a97a",
  },
  {
    slug: "myjool",
    title: "MYJOOL",
    subtitle: "מיתוג מילולי לסדרת תמרים יוקרתית",
    category: "מיתוג מילולי",
    year: "2023",
    description: "פיתוח שפה מוצרית ומדריך טון לסדרת תמרים פרימיום המיוצאת לשווקים בינלאומיים.",
    challenge: "תמרים הם מוצר שנחשב 'רגיל' בישראל. הלקוח ביקש שפה שתניח אותם על מדף הלוקסוס.",
    solution: "שפה שמחברת בין המקור (הארץ, העונה, המסורת) לחוויה העכשווית — בלי ליפול לנוסטלגיה זולה.",
    deliverables: ["שיום הסדרה", "שפה מוצרית", "מדריך טון", "תוכן אתר"],
    tags: ["מיתוג", "F&B", "יצוא", "לוקסוס"],
    featured: false,
    color: "#4a3a1a"
  }
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(p => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter(p => p.featured);
}
