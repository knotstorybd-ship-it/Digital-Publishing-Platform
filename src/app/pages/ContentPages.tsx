import { Link, useLocation } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CreditCard,
  FileText,
  HelpCircle,
  Mail,
  Phone,
  Scale,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

const Section = ({ title, items }: { title: string; items: string[] }) => (
  <section className="bg-white rounded-[2rem] border border-emerald-100/40 p-8 shadow-sm">
    <h2 className="text-2xl font-black text-emerald-950 mb-5">{title}</h2>
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-slate-600 font-medium leading-relaxed">
          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </section>
);

const PageShell = ({
  eyebrow,
  title,
  description,
  icon: Icon,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <div className="min-h-screen bg-[#fafbfc] pt-24 pb-20">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link to="/" className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-700 transition-colors group mb-8">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        হোমপেজে ফিরে যান
      </Link>
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 mb-6">
          <Icon className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.24em]">{eyebrow}</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-emerald-950 tracking-tight mb-5">{title}</h1>
        <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-3xl">{description}</p>
      </div>
      <div className="space-y-8">{children}</div>
    </div>
  </div>
);

export function AboutPage() {
  return (
    <PageShell
      eyebrow="About"
      title="ডিজিটাল প্রকাশনী সম্পর্কে"
      description="ডিজিটাল প্রকাশনী বাংলা বই, লেখক ও পাঠকদের জন্য তৈরি একটি অনলাইন প্রকাশনা প্ল্যাটফর্ম। এখানে লেখকরা ডিজিটাল বই প্রকাশ করতে পারেন এবং পাঠকরা সহজে বই খুঁজে, কিনে ও পড়তে পারেন।"
      icon={BookOpen}
    >
      <Section
        title="আমাদের লক্ষ্য"
        items={[
          "বাংলা লেখকদের জন্য সহজ, স্বচ্ছ ও ডিজিটাল প্রকাশনা অভিজ্ঞতা তৈরি করা।",
          "পাঠকদের জন্য নির্ভরযোগ্য ডিজিটাল বই সংগ্রহশালা তৈরি করা।",
          "লেখক, পাঠক, পেমেন্ট ও বই ব্যবস্থাপনাকে এক জায়গায় আনা।",
        ]}
      />
      <Section
        title="প্ল্যাটফর্মে যা থাকবে"
        items={[
          "ডিজিটাল বই ক্যাটালগ, লেখক প্রোফাইল, কার্ট ও চেকআউট ফ্লো।",
          "লেখকদের জন্য বই আপলোড, বিক্রয় ট্র্যাকিং ও রয়্যালটি ড্যাশবোর্ড।",
          "এডমিনের জন্য বই, লেখক, অর্ডার, টেস্টিমোনিয়াল ও সাইট কনটেন্ট ম্যানেজমেন্ট।",
        ]}
      />
    </PageShell>
  );
}

export function ContactPage() {
  return (
    <PageShell
      eyebrow="Contact"
      title="যোগাযোগ"
      description="বই, পেমেন্ট, লেখক নিবন্ধন বা প্রকাশনা সংক্রান্ত সহায়তার জন্য নিচের যোগাযোগ মাধ্যম ব্যবহার করুন।"
      icon={Mail}
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[2rem] border border-emerald-100/40 p-8">
          <Mail className="w-8 h-8 text-emerald-600 mb-4" />
          <h2 className="text-xl font-black text-emerald-950 mb-2">ইমেইল</h2>
          <a href="mailto:info@digitalprokashoni.com" className="font-bold text-emerald-600">
            info@digitalprokashoni.com
          </a>
        </div>
        <div className="bg-white rounded-[2rem] border border-emerald-100/40 p-8">
          <Phone className="w-8 h-8 text-emerald-600 mb-4" />
          <h2 className="text-xl font-black text-emerald-950 mb-2">ফোন</h2>
          <a href="tel:+8801868519685" className="font-bold text-emerald-600">
            +8801868519685
          </a>
        </div>
      </div>
      <Section
        title="সহায়তার জন্য তথ্য পাঠান"
        items={[
          "পেমেন্ট সমস্যা হলে ট্রানজেকশন আইডি, ইমেইল ও মোবাইল নম্বর দিন।",
          "বই আপলোড সমস্যা হলে বইয়ের নাম, ফাইল টাইপ ও স্ক্রিনশট দিন।",
          "লেখক অ্যাকাউন্ট সমস্যা হলে নিবন্ধিত ইমেইল ও প্ল্যানের নাম দিন।",
        ]}
      />
    </PageShell>
  );
}

export function SupportPage() {
  return (
    <PageShell
      eyebrow="Support"
      title="সাপোর্ট সেন্টার"
      description="পাঠক, লেখক ও এডমিন কাজের জন্য প্রয়োজনীয় সহায়তার বিষয়গুলো এখানে সাজানো হয়েছে।"
      icon={HelpCircle}
    >
      <Section
        title="পাঠক সহায়তা"
        items={[
          "লগইন, বই খোঁজা, কার্টে যোগ করা, পেমেন্ট ও কেনা বই পড়ার সহায়তা।",
          "কেনা বই লাইব্রেরিতে না দেখালে অর্ডার তথ্যসহ সাপোর্টে যোগাযোগ করুন।",
          "ডিজিটাল ফাইল ডাউনলোডে সমস্যা হলে ব্রাউজার ও ডিভাইস তথ্য দিন।",
        ]}
      />
      <Section
        title="লেখক সহায়তা"
        items={[
          "লেখক নিবন্ধন, প্ল্যান নির্বাচন, প্রোফাইল তৈরি ও বই আপলোড নির্দেশনা।",
          "কভার ইমেজ, PDF/EPUB ফাইল, বইয়ের সারসংক্ষেপ ও সঠিক ক্যাটেগরি প্রস্তুত রাখুন।",
          "রয়্যালটি বা বিক্রয় ডেটা নিয়ে প্রশ্ন থাকলে বইয়ের নাম ও সময়কাল উল্লেখ করুন।",
        ]}
      />
      <Section
        title="পেমেন্ট সহায়তা"
        items={[
          "বর্তমান পেমেন্ট ফ্লো টেস্ট মোডে আছে; বাস্তব পেমেন্ট চালুর আগে প্রোভাইডার ভেরিফিকেশন দরকার।",
          "পেমেন্ট সফল হলেও অর্ডার না হলে ট্রানজেকশন আইডি সংরক্ষণ করুন।",
          "রিফান্ড বা বাতিল সংক্রান্ত নিয়ম রিফান্ড পলিসি অনুযায়ী নির্ধারিত হবে।",
        ]}
      />
    </PageShell>
  );
}

const legalContent: Record<string, { title: string; description: string; sections: { title: string; items: string[] }[] }> = {
  "/terms": {
    title: "Terms and Conditions",
    description: "এই পেজটি প্ল্যাটফর্ম ব্যবহারের প্রাথমিক নিয়ম, ব্যবহারকারীর দায়িত্ব এবং ডিজিটাল কনটেন্ট ব্যবহারের শর্ত ব্যাখ্যা করে।",
    sections: [
      {
        title: "ব্যবহারের নিয়ম",
        items: [
          "ব্যবহারকারীকে সঠিক অ্যাকাউন্ট তথ্য ব্যবহার করতে হবে।",
          "কেনা ডিজিটাল বই ব্যক্তিগত ব্যবহারের জন্য; অনুমতি ছাড়া পুনরায় বিতরণ করা যাবে না।",
          "প্ল্যাটফর্ম অপব্যবহার, প্রতারণা বা কপিরাইট লঙ্ঘন করলে অ্যাকাউন্ট সীমিত করা হতে পারে।",
        ],
      },
      {
        title: "পরিবর্তন",
        items: ["সেবা, ফি, নীতি ও ফিচার সময় অনুযায়ী পরিবর্তন হতে পারে। গুরুত্বপূর্ণ পরিবর্তন ব্যবহারকারীদের জানানো হবে।"],
      },
    ],
  },
  "/privacy": {
    title: "Privacy Policy",
    description: "ব্যবহারকারীর তথ্য কীভাবে সংগ্রহ, ব্যবহার ও সুরক্ষিত রাখা হবে তার সারাংশ।",
    sections: [
      {
        title: "সংগৃহীত তথ্য",
        items: ["নাম, ইমেইল, ফোন, প্রোফাইল তথ্য, অর্ডার তথ্য ও পেমেন্ট রেফারেন্স সংগ্রহ করা হতে পারে।"],
      },
      {
        title: "তথ্য ব্যবহার",
        items: ["অ্যাকাউন্ট, বই ক্রয়, লেখক নিবন্ধন, সাপোর্ট, নিরাপত্তা ও প্ল্যাটফর্ম উন্নয়নের জন্য তথ্য ব্যবহার করা হয়।"],
      },
    ],
  },
  "/refund-policy": {
    title: "Refund Policy",
    description: "ডিজিটাল বই ও লেখক সাবস্ক্রিপশনের রিফান্ড বিষয়ক প্রাথমিক নীতি।",
    sections: [
      {
        title: "ডিজিটাল বই",
        items: [
          "ডিজিটাল বই ডেলিভারি সম্পন্ন হলে সাধারণত রিফান্ড প্রযোজ্য নয়।",
          "ভুল চার্জ, ডুপ্লিকেট পেমেন্ট বা ফাইল অ্যাক্সেস না পেলে সাপোর্টে যোগাযোগ করতে হবে।",
        ],
      },
      {
        title: "লেখক প্ল্যান",
        items: ["লেখক সাবস্ক্রিপশন রিফান্ড বাস্তব পেমেন্ট প্রোভাইডার চালুর পর নির্দিষ্ট নিয়মে নির্ধারিত হবে।"],
      },
    ],
  },
  "/copyright-policy": {
    title: "Copyright Policy",
    description: "লেখক ও প্রকাশিত কনটেন্টের কপিরাইট সম্পর্কিত প্রাথমিক নির্দেশনা।",
    sections: [
      {
        title: "লেখকের দায়িত্ব",
        items: [
          "লেখককে নিশ্চিত করতে হবে যে জমা দেওয়া বই, কভার ও কনটেন্ট তার নিজের বা ব্যবহারের অনুমতি আছে।",
          "কপিরাইট অভিযোগ পেলে সংশ্লিষ্ট কনটেন্ট পর্যালোচনার জন্য সাময়িকভাবে সরানো হতে পারে।",
        ],
      },
    ],
  },
  "/writer-agreement": {
    title: "Writer Agreement",
    description: "লেখক হিসেবে প্ল্যাটফর্ম ব্যবহারের প্রাথমিক চুক্তির সারাংশ।",
    sections: [
      {
        title: "প্রকাশনা ও রয়্যালটি",
        items: [
          "লেখক প্ল্যান অনুযায়ী বই প্রকাশ করতে পারবেন।",
          "রয়্যালটি হার, পেমেন্ট সাইকেল ও প্ল্যাটফর্ম ফি চালুর আগে লিখিতভাবে নিশ্চিত করা হবে।",
          "বই অনুমোদন, কপিরাইট যাচাই ও মান নিয়ন্ত্রণের অধিকার প্ল্যাটফর্মের থাকবে।",
        ],
      },
    ],
  },
  "/payment-terms": {
    title: "Payment Terms",
    description: "পেমেন্ট, অর্ডার, ট্রানজেকশন রেকর্ড ও ভেরিফিকেশন সম্পর্কিত নির্দেশনা।",
    sections: [
      {
        title: "পেমেন্ট অবস্থা",
        items: [
          "বর্তমান অ্যাপে টেস্ট পেমেন্ট ফ্লো আছে; বাস্তব টাকা নেওয়ার আগে লাইভ পেমেন্ট প্রোভাইডার যুক্ত করতে হবে।",
          "অর্ডার কেবল যাচাইকৃত পেমেন্টের ভিত্তিতে তৈরি হওয়া উচিত।",
          "প্রতিটি পেমেন্টের ট্রানজেকশন আইডি সংরক্ষণ করা হবে।",
        ],
      },
    ],
  },
};

export function LegalPage() {
  const location = useLocation();
  const page = legalContent[location.pathname] || legalContent["/terms"];

  return (
    <PageShell eyebrow="Policy" title={page.title} description={page.description} icon={Scale}>
      <div className="bg-amber-50 border border-amber-100 rounded-[2rem] p-6 flex gap-4">
        <ShieldCheck className="w-6 h-6 text-amber-600 shrink-0" />
        <p className="text-sm font-bold text-amber-900/80 leading-relaxed">
          এটি প্রোডাকশন লঞ্চের জন্য কনটেন্ট কাঠামো। চূড়ান্ত প্রকাশের আগে স্থানীয় আইনজীবী বা নীতিমালা বিশেষজ্ঞ দিয়ে যাচাই করা উচিত।
        </p>
      </div>
      {page.sections.map((section) => (
        <Section key={section.title} title={section.title} items={section.items} />
      ))}
      <div className="grid md:grid-cols-2 gap-5">
        <Link to="/support" className="bg-white rounded-[2rem] border border-emerald-100 p-6 font-black text-emerald-700 flex items-center justify-between">
          সাপোর্ট সেন্টার
          <ArrowRight className="w-5 h-5" />
        </Link>
        <Link to="/contact" className="bg-white rounded-[2rem] border border-emerald-100 p-6 font-black text-emerald-700 flex items-center justify-between">
          যোগাযোগ করুন
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </PageShell>
  );
}

export function PublishingPolicyPage() {
  return (
    <PageShell
      eyebrow="Publishing"
      title="প্রকাশনা নীতিমালা"
      description="লেখকদের বই জমা, অনুমোদন, কনটেন্ট মান, ফাইল প্রস্তুতি ও কপিরাইট দায়িত্বের প্রাথমিক নিয়ম।"
      icon={FileText}
    >
      <Section
        title="বই জমা দেওয়ার আগে"
        items={[
          "বইয়ের শিরোনাম, লেখকের নাম, ক্যাটেগরি, মূল্য, কভার ইমেজ, PDF/EPUB ফাইল ও সারসংক্ষেপ প্রস্তুত রাখতে হবে।",
          "কভার ইমেজ পরিষ্কার, পাঠযোগ্য এবং বইয়ের বিষয়ের সঙ্গে সামঞ্জস্যপূর্ণ হতে হবে।",
          "ডিজিটাল ফাইল সম্পূর্ণ, পাঠযোগ্য এবং অনুমোদিত ফরম্যাটে হতে হবে।",
        ]}
      />
      <Section
        title="অনুমোদন নীতি"
        items={[
          "কপিরাইট লঙ্ঘন, ভুল তথ্য, ক্ষতিকর কনটেন্ট বা অসম্পূর্ণ ফাইল পেলে বই প্রকাশ স্থগিত হতে পারে।",
          "এডমিন প্রয়োজন হলে লেখকের কাছ থেকে অতিরিক্ত তথ্য চাইতে পারে।",
          "বই প্রকাশের পরেও গুরুতর অভিযোগ পেলে কনটেন্ট পুনরায় পর্যালোচনা করা হতে পারে।",
        ]}
      />
    </PageShell>
  );
}

export function ReaderTermsPage() {
  return (
    <PageShell
      eyebrow="Readers"
      title="পাঠক নির্দেশিকা"
      description="বই কেনা, পড়া, ডাউনলোড, লাইব্রেরি ও সাপোর্ট ব্যবহারের নিয়ম।"
      icon={UserCheck}
    >
      <Section
        title="কেনা ও পড়া"
        items={[
          "বই কেনার জন্য লগইন করতে হবে।",
          "ক্রয় সম্পন্ন হলে বই ব্যবহারকারীর লাইব্রেরিতে যুক্ত হবে।",
          "ডিজিটাল বই ব্যক্তিগত ব্যবহারের জন্য; অনুমতি ছাড়া শেয়ার বা পুনরায় বিক্রি করা যাবে না।",
        ]}
      />
      <Section
        title="সমস্যা হলে"
        items={[
          "বই না খুললে বা ডাউনলোড না হলে সাপোর্টে বইয়ের নাম ও অর্ডার তথ্য পাঠান।",
          "পেমেন্ট কেটে গেলে কিন্তু বই না এলে ট্রানজেকশন আইডি দিয়ে যোগাযোগ করুন।",
        ]}
      />
    </PageShell>
  );
}

export function PaymentInfoPage() {
  return (
    <PageShell
      eyebrow="Payments"
      title="পেমেন্ট তথ্য"
      description="বর্তমান পেমেন্ট অবস্থা, টেস্ট মোড এবং লাইভ পেমেন্ট চালুর আগে প্রয়োজনীয় বিষয়।"
      icon={CreditCard}
    >
      <Section
        title="বর্তমান অবস্থা"
        items={[
          "অ্যাপে এখন টেস্ট পেমেন্ট ফ্লো আছে, যা বাস্তব টাকা চার্জ করে না।",
          "লাইভ করার আগে bKash/Nagad/SSLCommerz বা নির্ধারিত প্রোভাইডারের মার্চেন্ট অ্যাকাউন্ট দরকার।",
          "ব্যাকএন্ড পেমেন্ট ভেরিফিকেশন ছাড়া বাস্তব অর্ডার তৈরি করা উচিত নয়।",
        ]}
      />
    </PageShell>
  );
}
