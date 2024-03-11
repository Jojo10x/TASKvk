import { useEffect, useState } from 'react';
import './App.css';
import groupsData from './groups.json';

interface GetGroupsResponse {
  result: 1 | 0;
  data?: Group[];
}

interface Group {
  id: number;
  name: string;
  closed: boolean;
  avatar_color?: string;
  members_count: number;
  friends?: User[];
  showFriends?: boolean;
}

interface User {
  first_name: string;
  last_name: string;
}

const App = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [privacyFilter, setPrivacyFilter] = useState<'all' | 'closed' | 'open'>('all');
  const [colorFilter, setColorFilter] = useState<string>('any');
  const [friendFilter, setFriendFilter] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = () => {
      const delay = setTimeout(() => {
        const response: GetGroupsResponse = { result: 1, data: groupsData };
        setGroups(response.data || []);
        setLoading(false);
      }, 1000);

      return () => clearTimeout(delay);
    };

    fetchData();
  }, []);

  const renderFriends = (friends?: User[]) => {
    if (!friends) return null;
    return friends.map((friend, index) => (
      <div key={index}>
        {friend.first_name} {friend.last_name}
      </div>
    ));
  };

  const filteredGroups = groups.filter(group => {
    if (privacyFilter === 'all' || group.closed === (privacyFilter === 'closed')) {
      if (colorFilter === 'any' || group.avatar_color === colorFilter) {
        if (!friendFilter || (friendFilter && group.friends && group.friends.length > 0)) {
          return true;
        }
      }
    }
    return false;
  });

  const toggleFriendList = (groupId: number) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        return { ...group, showFriends: !group.showFriends };
      }
      return group;
    }));
  };

  const renderGroups = () => {
    if (loading) return <div>Loading...</div>;
    if (filteredGroups.length === 0) return <div>No groups found.</div>;
  
    return filteredGroups.map(group => (
      <div key={group.id}>
        <h3>{group.name}</h3>
        {group.avatar_color && (
          <div
            className="avatar"
            style={{
              backgroundColor: group.avatar_color,
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              display: 'inline-block',
              marginRight: '10px'
            }}
          ></div>
        )}
        <p>{group.closed ? 'Closed' : 'Open'}</p>
        <p>Members count: {group.members_count}</p>
        {group.friends && (
          <div>
            Friends:
            {group.showFriends && renderFriends(group.friends)}
            <span
              className="friend-count"
              onClick={() => toggleFriendList(group.id)}
            >
              {group.friends.length}
            </span>
          </div>
        )}
      </div>
    ));
  };
  

  return (
    <div className="App">
      <h1>My Groups</h1>
      <div className="filters">
        <select value={privacyFilter} onChange={e => setPrivacyFilter(e.target.value as 'all' | 'closed' | 'open')}>
          <option value="all">All</option>
          <option value="closed">Closed</option>
          <option value="open">Open</option>
        </select>
        <select value={colorFilter} onChange={e => setColorFilter(e.target.value)}>
          <option value="any">Any Color</option>
          <option value="red">Red</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="purple">Purple</option>
          <option value="white">White</option>
          <option value="orange">Orange</option>
        </select>
        <input
          type="checkbox"
          checked={friendFilter}
          onChange={() => setFriendFilter(!friendFilter)}
        />
        <label>Has Friends</label>
      </div>
      {renderGroups()}
    </div>
  );
};

export default App;
