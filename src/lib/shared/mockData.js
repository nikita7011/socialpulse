// --- Mock Data Generator Utilities ---
export const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

export const generateSeededHeatmap = (username) => {
  const seed = hashCode(username || "nikita7011");
  const getSeededRandom = (offset) => {
    const x = Math.sin(seed + offset) * 10000;
    return x - Math.floor(x);
  };
  
  const grid = [];
  for (let d = 0; d < 7; d++) {
    const row = [];
    for (let h = 0; h < 7; h++) {
      row.push(Math.floor(getSeededRandom(100 + d * 10 + h) * 10));
    }
    grid.push(row);
  }
  return grid;
};

export const generateMockTimePerformance = () => {
  const data = [];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  for (let day_num = 0; day_num < 7; day_num++) {
    const day_of_week = days[day_num];
    for (let post_hour = 0; post_hour < 24; post_hour++) {
      let rate = 1.5 + Math.random() * 2;
      if ((post_hour >= 9 && post_hour <= 11) || (post_hour >= 17 && post_hour <= 19)) {
        rate += 3.5 + Math.random() * 3;
      }
      data.push({
        post_hour,
        day_of_week,
        day_num,
        total_posts: Math.floor(2 + Math.random() * 5),
        avg_engagement_rate_pct: parseFloat(rate.toFixed(2))
      });
    }
  }
  return data;
};

export const generateSeededStats = (username, connectedPlatforms = null) => {
  const seed = hashCode(username || "nikita7011");
  const isDefault = !username || username === "@nikita7011" || username === "nikita7011";
  
  const getSeededRandom = (offset) => {
    const x = Math.sin(seed + offset) * 10000;
    return x - Math.floor(x);
  };

  const total_posts = Math.floor(150 + getSeededRandom(1) * 300);
  const total_reach = Math.floor(250000 + getSeededRandom(2) * 2000000);
  const total_interactions = Math.floor(15000 + getSeededRandom(3) * 150000);
  const avg_engagement_rate = parseFloat((4.2 + getSeededRandom(4) * 8.0).toFixed(2));
  
  const followers_gained = Math.floor(500 + getSeededRandom(5) * 5000);
  const followers_lost = Math.floor(50 + getSeededRandom(6) * 1000);
  const net_growth = followers_gained - followers_lost;
  const follower_count = Math.floor(8000 + getSeededRandom(7) * 45000);

  // Gained followers list
  const firstNames = ["Emily", "David", "Jessica", "James", "Sarah", "Michael", "Sophia", "Alex", "Chloe", "Ryan"];
  const lastNames = ["Chen", "Smith", "Rodriguez", "Jones", "Miller", "Kim", "Patel", "Garcia", "Davis", "Taylor"];
  
  const gainedList = [];
  for (let i = 0; i < 5; i++) {
    const indexFn = Math.floor(getSeededRandom(8 + i) * firstNames.length);
    const indexLn = Math.floor(getSeededRandom(15 + i) * lastNames.length);
    const handle = `${firstNames[indexFn].toLowerCase()}_${lastNames[indexLn].toLowerCase()}${Math.floor(getSeededRandom(22 + i) * 99)}`;
    gainedList.push({
      handle: `@${handle}`,
      name: `${firstNames[indexFn]} ${lastNames[indexLn]}`,
      date: `2026-07-${15 - i}`,
      avatar: firstNames[indexFn][0]
    });
  }

  // Lost followers list (unfollowers)
  const unfollowersList = [];
  for (let i = 0; i < 5; i++) {
    const indexFn = Math.floor(getSeededRandom(30 + i) * firstNames.length);
    const indexLn = Math.floor(getSeededRandom(37 + i) * lastNames.length);
    const handle = `${firstNames[indexFn].toLowerCase()}_${lastNames[indexLn].toLowerCase()}${Math.floor(getSeededRandom(44 + i) * 99)}`;
    unfollowersList.push({
      handle: `@${handle}`,
      name: `${firstNames[indexFn]} ${lastNames[indexLn]}`,
      date: `2026-07-${14 - i}`,
      avatar: firstNames[indexFn][0]
    });
  }

  const platforms = ["Instagram", "LinkedIn", "YouTube", "Twitter"];
  const posts = [];
  const categories = {
    Instagram: ["video", "carousel", "image"],
    LinkedIn: ["carousel", "text", "image"],
    YouTube: ["video", "image"],
    Twitter: ["text", "image", "video"]
  };
  const sampleContexts = [
    "Breaking down SQL database metrics live. 📊 #data",
    "Why agentic AI is transforming workflows in 2026. 🤖 #ai",
    "Aesthetic setup morning view. ☕ #desk",
    "How to write clean SQL queries. 💻 #developer",
    "SocialPulse dashboard release announcement! 🎉 #marketing",
    "10 tips for growth scaling. 🚀 #creator",
    "Behind the scenes of content production. 🎬 #creative",
    "Understanding audience reach data. 📈 #analytics",
    "My favorite VSCode extensions. 🛠 #coder",
    "Why consistency beats algorithm hacks. 🎯 #mindset"
  ];

  for (let i = 0; i < 10; i++) {
    const platform = platforms[i % 4];
    const type = categories[platform][Math.floor(getSeededRandom(51 + i) * categories[platform].length)];
    const postReach = Math.floor(5000 + getSeededRandom(58 + i) * 20000);
    const postImpressions = Math.floor(postReach * (1.1 + getSeededRandom(65 + i) * 0.4));
    const er = parseFloat((5.5 + getSeededRandom(72 + i) * 8.5).toFixed(2));
    const postInteractions = Math.floor((postReach * er) / 100);
    const likes = Math.floor(postInteractions * 0.7);
    const comments = Math.floor(postInteractions * 0.18);
    const shares = postInteractions - likes - comments;

    posts.push({
      post_id: 2000 + i,
      platform,
      account_name: username,
      post_type: type,
      post_date: `2026-07-${15 - i} 12:00:00`,
      caption_length: 50 + Math.floor(getSeededRandom(79 + i) * 150),
      hashtag_count: 2 + Math.floor(getSeededRandom(86 + i) * 6),
      likes,
      comments,
      shares,
      impressions: postImpressions,
      reach: postReach,
      engagement_rate_pct: er,
      caption: sampleContexts[i]
    });
  }

  const platformPerformance = [
    { platform: "Instagram", total_posts: Math.floor(total_posts * 0.3), total_likes: Math.floor(total_interactions * 0.7 * 0.35), total_comments: Math.floor(total_interactions * 0.15 * 0.35), total_shares: Math.floor(total_interactions * 0.15 * 0.35), total_reach: Math.floor(total_reach * 0.3) },
    { platform: "LinkedIn", total_posts: Math.floor(total_posts * 0.25), total_likes: Math.floor(total_interactions * 0.7 * 0.28), total_comments: Math.floor(total_interactions * 0.15 * 0.28), total_shares: Math.floor(total_interactions * 0.15 * 0.28), total_reach: Math.floor(total_reach * 0.25) },
    { platform: "YouTube", total_posts: Math.floor(total_posts * 0.2), total_likes: Math.floor(total_interactions * 0.7 * 0.22), total_comments: Math.floor(total_interactions * 0.15 * 0.22), total_shares: Math.floor(total_interactions * 0.15 * 0.22), total_reach: Math.floor(total_reach * 0.28) },
    { platform: "Twitter", total_posts: Math.floor(total_posts * 0.25), total_likes: Math.floor(total_interactions * 0.7 * 0.15), total_comments: Math.floor(total_interactions * 0.15 * 0.15), total_shares: Math.floor(total_interactions * 0.15 * 0.15), total_reach: Math.floor(total_reach * 0.17) }
  ];

  const postTypes = [
    { platform: "Instagram", post_type: "video", total_posts: 15, avg_reach: 12000, avg_engagement_rate_pct: 11.2 },
    { platform: "Instagram", post_type: "carousel", total_posts: 10, avg_reach: 8500, avg_engagement_rate_pct: 5.4 },
    { platform: "Instagram", post_type: "image", total_posts: 5, avg_reach: 7000, avg_engagement_rate_pct: 3.1 },
    { platform: "LinkedIn", post_type: "carousel", total_posts: 12, avg_reach: 9500, avg_engagement_rate_pct: 7.8 },
    { platform: "LinkedIn", post_type: "text", total_posts: 10, avg_reach: 6000, avg_engagement_rate_pct: 3.9 },
    { platform: "LinkedIn", post_type: "image", total_posts: 3, avg_reach: 5000, avg_engagement_rate_pct: 2.1 },
    { platform: "YouTube", post_type: "video", total_posts: 20, avg_reach: 18000, avg_engagement_rate_pct: 6.2 },
    { platform: "YouTube", post_type: "image", total_posts: 5, avg_reach: 4000, avg_engagement_rate_pct: 1.8 },
    { platform: "Twitter", post_type: "video", total_posts: 5, avg_reach: 6500, avg_engagement_rate_pct: 4.2 },
    { platform: "Twitter", post_type: "image", total_posts: 10, avg_reach: 5000, avg_engagement_rate_pct: 2.8 },
    { platform: "Twitter", post_type: "text", total_posts: 15, avg_reach: 3500, avg_engagement_rate_pct: 2.5 }
  ];

  const followersGrowth = [];
  for (let m = 0; m < 12; m++) {
    const dateVal = new Date(2025, 6 + m, 15).toISOString().slice(0, 10);
    followersGrowth.push({ platform: "Instagram", snapshot_date: dateVal, follower_count: Math.floor(follower_count * 0.7 * Math.pow(1.03, m)) });
    followersGrowth.push({ platform: "LinkedIn", snapshot_date: dateVal, follower_count: Math.floor(follower_count * 0.4 * Math.pow(1.04, m)) });
    followersGrowth.push({ platform: "YouTube", snapshot_date: dateVal, follower_count: Math.floor(follower_count * 0.5 * Math.pow(1.02, m)) });
    followersGrowth.push({ platform: "Twitter", snapshot_date: dateVal, follower_count: Math.floor(follower_count * 0.3 * Math.pow(1.01, m)) });
  }

  const timePerformance = generateMockTimePerformance();

  let filteredPosts = posts;
  let filteredPlatformPerformance = platformPerformance;
  let filteredPostTypes = postTypes;
  let filteredFollowersGrowth = followersGrowth;

  if (connectedPlatforms && connectedPlatforms.length > 0) {
    filteredPosts = posts.filter(p => connectedPlatforms.includes(p.platform));
    filteredPlatformPerformance = platformPerformance.filter(p => connectedPlatforms.includes(p.platform));
    filteredPostTypes = postTypes.filter(p => connectedPlatforms.includes(p.platform));
    filteredFollowersGrowth = followersGrowth.filter(p => connectedPlatforms.includes(p.platform));
  }

  const highestViewPost = [...filteredPosts].sort((a, b) => b.reach - a.reach)[0];
  const highestLikesPost = [...filteredPosts].sort((a, b) => b.likes - a.likes)[0];

  const total_reach_filtered = filteredPlatformPerformance.reduce((sum, p) => sum + p.total_reach, 0);
  const total_interactions_filtered = filteredPlatformPerformance.reduce((sum, p) => sum + p.total_likes + p.total_comments + p.total_shares, 0);
  const total_posts_filtered = filteredPlatformPerformance.reduce((sum, p) => sum + p.total_posts, 0);

  // Recalculate total follower count from the last date snapshot for connected platforms
  const lastSnapshotDate = followersGrowth.length > 0 ? followersGrowth[followersGrowth.length - 1].snapshot_date : null;
  const follower_count_filtered = lastSnapshotDate 
    ? filteredFollowersGrowth.filter(f => f.snapshot_date === lastSnapshotDate).reduce((sum, f) => sum + f.follower_count, 0)
    : follower_count;

  return {
    isDefault,
    kpis: {
      total_posts: connectedPlatforms ? total_posts_filtered : total_posts,
      total_reach: connectedPlatforms ? total_reach_filtered : total_reach,
      total_interactions: connectedPlatforms ? total_interactions_filtered : total_interactions,
      avg_engagement_rate
    },
    growth: {
      followers_gained,
      followers_lost,
      net_growth,
      follower_count: connectedPlatforms ? follower_count_filtered : follower_count,
      gainedList,
      unfollowersList
    },
    platformPerformance: filteredPlatformPerformance,
    postTypes: filteredPostTypes,
    followersGrowth: filteredFollowersGrowth,
    timePerformance,
    topPosts: filteredPosts,
    highestViewPost,
    highestLikesPost
  };
};
