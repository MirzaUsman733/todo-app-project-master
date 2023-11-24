import { Calendar, theme } from 'antd';
import { useStickyNotes } from 'contexts/StickyNotesContext';
import { useState } from 'react';

export default function Hero() {
  const { stickyNotes } = useStickyNotes();
  const [selectedDate, setSelectedDate] = useState(null);

  const onSelect = (value) => {
    const formattedDate = value.format('YYYY-MM-DD');
    setSelectedDate(formattedDate);
  };
  const calenderrStickyNotes = stickyNotes.filter(
    (note) => note.date === selectedDate
  );

  const { token } = theme.useToken();
  const wrapperStyle = {
    width: '100%',
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };
  return (
    <div>
      <div style={wrapperStyle}>
        <Calendar fullscreen={false} onSelect={onSelect} />
      </div>
      <div>
        <div className="container mt-4">
          <ul className="row">
            {calenderrStickyNotes?.map((stickyNote) => (
              <li
                className="col-4"
                style={{ listStyleType: 'none' }}
                key={stickyNote.id}
              >
                <div
                  className="stick"
                  style={{
                    backgroundColor: stickyNote.color || '#F8F9FA',
                    padding: '10px',
                    marginBottom: '10px',
                    borderRadius: '10px',
                    height: '250px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <h4>{stickyNote.title}</h4>
                    <div className="dropdown">
                      <div className="dropdown-toggle">⋮</div>
                      <div className="dropdown-content text-center"></div>
                    </div>
                  </div>
                  <div className="stickyDescription">
                    <p>{stickyNote.description}</p>
                  </div>
                  <p>
                    {stickyNote.dateCreated?.seconds &&
                      new Date(
                        stickyNote.dateCreated.seconds * 1000
                      ).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
