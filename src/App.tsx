import { useState, useEffect } from 'react';
import './App.css';

// Type definition for a holiday object from the Nager.Date API
interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
}

// Dictionary for UI text in multiple languages
const uiText = {
  en: {
    title: 'Holiday Checker',
    today: 'Today',
    tomorrow: 'Tomorrow',
    nextHoliday: 'Next Holiday',
    weekday: 'Weekday',
    weekend: 'Weekend',
    holiday: 'Holiday',
    error: 'Failed to load holiday data.',
    noNextHoliday: 'No upcoming holidays found.',
    loading: 'Loading...',
  },
  jp: {
    title: '祝日チェッカー',
    today: '今日',
    tomorrow: '明日',
    nextHoliday: '次の祝日',
    weekday: '平日です',
    weekend: '休日です',
    holiday: '祝日',
    error: '祝日データの取得に失敗しました。',
    noNextHoliday: '次の祝日は見つかりませんでした。',
    loading: '読み込み中...',
  },
};

// List of supported countries
const supportedCountries = [
  { code: 'JP', name: { en: 'Japan', jp: '日本' } },
  { code: 'US', name: { en: 'USA', jp: 'アメリカ' } },
  { code: 'GB', name: { en: 'UK', jp: 'イギリス' } },
  { code: 'FR', name: { en: 'France', jp: 'フランス' } },
  { code: 'DE', name: { en: 'Germany', jp: 'ドイツ' } },
  { code: 'IT', name: { en: 'Italy', jp: 'イタリア' } },
  { code: 'CA', name: { en: 'Canada', jp: 'カナダ' } },
  { code: 'AU', name: { en: 'Australia', jp: 'オーストラリア' } },
  { code: 'PH', name: { en: 'Philippines', jp: 'フィリピン' } },
];

// Helper function to convert country code to flag emoji
const getFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

// Helper function to format date string
const formatDate = (date: Date, lang: 'en' | 'jp') => {
  if (lang === 'jp') {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
    return `${year}年 ${month}月 ${day}日 (${dayOfWeek})`;
  }
  // English format
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

function App() {
  const [lang, setLang] = useState<'en' | 'jp'>('en');
  const [country, setCountry] = useState('JP');
  const [todayInfo, setTodayInfo] = useState<string>(uiText[lang].loading);
  const [nextDayInfo, setNextDayInfo] = useState<string>(uiText[lang].loading);
  const [nextHoliday, setNextHoliday] = useState<string>(uiText[lang].loading);
  const [todayDate, setTodayDate] = useState(new Date());
  const [tomorrowDate, setTomorrowDate] = useState(new Date());

  useEffect(() => {
    setTodayDate(new Date());
    const tomorrow = new Date();
    tomorrow.setDate(new Date().getDate() + 1);
    setTomorrowDate(tomorrow);

    const fetchHolidays = async () => {
      const t = uiText[lang];
      setTodayInfo(t.loading);
      setNextDayInfo(t.loading);
      setNextHoliday(t.loading);
      try {
        const year = todayDate.getFullYear();
        const [response, nextYearResponse] = await Promise.all([
          fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`),
          fetch(`https://date.nager.at/api/v3/PublicHolidays/${year + 1}/${country}`),
        ]);

        if (!response.ok || !nextYearResponse.ok) {
          throw new Error(t.error);
        }
        const holidays: Holiday[] = await response.json();
        const nextYearHolidays: Holiday[] = await nextYearResponse.json();
        const allHolidays = [...holidays, ...nextYearHolidays];

        // Today's status
        const todayString = `${todayDate.getFullYear()}-${(todayDate.getMonth() + 1).toString().padStart(2, '0')}-${todayDate.getDate().toString().padStart(2, '0')}`;
        const todayHoliday = allHolidays.find(h => h.date === todayString);
        if (todayHoliday) {
          const holidayName = lang === 'jp' ? todayHoliday.localName : todayHoliday.name;
          setTodayInfo(`${t.holiday} (${holidayName})`);
        } else if (todayDate.getDay() === 0 || todayDate.getDay() === 6) {
          setTodayInfo(t.weekend);
        } else {
          setTodayInfo(t.weekday);
        }

        // Tomorrow's status
        const tomorrowString = `${tomorrowDate.getFullYear()}-${(tomorrowDate.getMonth() + 1).toString().padStart(2, '0')}-${tomorrowDate.getDate().toString().padStart(2, '0')}`;
        const tomorrowHoliday = allHolidays.find(h => h.date === tomorrowString);
        if (tomorrowHoliday) {
            const holidayName = lang === 'jp' ? tomorrowHoliday.localName : tomorrowHoliday.name;
            setNextDayInfo(`${t.holiday} (${holidayName})`);
        } else if (tomorrowDate.getDay() === 0 || tomorrowDate.getDay() === 6) {
          setNextDayInfo(t.weekend);
        } else {
          setNextDayInfo(t.weekday);
        }

        // Next holiday
        const upcomingHolidays = allHolidays.filter(h => new Date(h.date) > todayDate);
        if (upcomingHolidays.length > 0) {
          const next = upcomingHolidays[0];
          const date = new Date(next.date);
          const holidayName = lang === 'jp' ? next.localName : next.name;
          const formattedDate = formatDate(date, lang);
          setNextHoliday(`${formattedDate} - ${holidayName}`);
        } else {
          setNextHoliday(t.noNextHoliday);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : uiText[lang].error;
        setTodayInfo(message);
        setNextDayInfo('');
        setNextHoliday('');
      }
    };

    fetchHolidays();
  }, [country, lang]);

  const t = uiText[lang];
  const formattedToday = formatDate(todayDate, lang);
  const formattedTomorrow = formatDate(tomorrowDate, lang);

  return (
    <div className="card">
      <div className="language-switcher">
        <button onClick={() => setLang('en')} className={`lang-button ${lang === 'en' ? 'active' : ''}`}>EN</button>
        <button onClick={() => setLang('jp')} className={`lang-button ${lang === 'jp' ? 'active' : ''}`}>JP</button>
      </div>
      <h1>{t.title}</h1>
      <div className="country-selector">
        {supportedCountries.map((c) => (
          <button
            key={c.code}
            className={`country-button ${country === c.code ? 'active' : ''}`}
            onClick={() => setCountry(c.code)}
          >
            <span className="flag-icon">{getFlagEmoji(c.code)}</span>
            {c.name[lang]}
          </button>
        ))}
      </div>
      <hr />
      <div className="result-section">
        <div className="info-block">
          <p className="info-title">{t.today}: {formattedToday}</p>
          <p className={`result-content ${todayInfo.includes(t.holiday) || todayInfo.includes(t.weekend) ? 'holiday' : ''}`}>{todayInfo}</p>
        </div>
        <div className="info-block">
          <p className="info-title">{t.tomorrow}: {formattedTomorrow}</p>
          <p className={`result-content ${nextDayInfo.includes(t.holiday) || nextDayInfo.includes(t.weekend) ? 'holiday' : ''}`}>{nextDayInfo}</p>
        </div>
        <div className="info-block">
          <p className="info-title">{t.nextHoliday}</p>
          <p className="result-content">{nextHoliday}</p>
        </div>
      </div>
    </div>
  );
}

export default App;