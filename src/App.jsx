const DevChatBubble = ({ message, isUser, onPreview }) => {
  const [expanded, setExpanded] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);

  const toggleTheme = () => setDarkMode(!darkMode);

  const toggleExpand = () => setExpanded(!expanded);

  const renderContent = useMemo(() => {
    if (loading) return <LoadingSkeleton />;
    return expanded ? message.full : message.summary;
  }, [expanded, loading, message]);

  return (
    <div className={`chat-bubble ${darkMode ? 'dark' : 'light'}`}>
      <button aria-label="Toggle theme" onClick={toggleTheme}>
        Toggle {darkMode ? 'Light' : 'Dark'} Mode
      </button>
      <div aria-live="polite" className="message-content">
        {renderContent}
      </div>
      {message.isExpandable && (
        <button aria-expanded={expanded} onClick={toggleExpand}>
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
      {message.artifact && (
        <button onClick={() => onPreview(message.artifact)}>
          View Artifact
        </button>
      )}
    </div>
  );
};