import { ProfileStory } from './ProfileStory';

interface Story {
  id: number;
  text: string;
  isRead: boolean;
}

interface ProfileStoriesProps {
  stories?: Story[];
}

const defaultStories: Story[] = [
  { id: 1, text: 'Новости', isRead: true },
  { id: 2, text: 'Сообщество', isRead: false },
  { id: 3, text: 'Сообщество', isRead: false },
  { id: 4, text: 'Сообщество', isRead: false },
];

export function ProfileStories({ stories = defaultStories }: ProfileStoriesProps) {
  return (
    <div className="profile-stories">
      {stories.map((story) => (
        <ProfileStory 
          key={story.id}
          text={story.text}
          isRead={story.isRead}
        />
      ))}
    </div>
  );
}
