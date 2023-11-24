import { useStickyNotes } from 'contexts/StickyNotesContext';
import React from 'react';
export default function Hero() {
  const { stickyNotes } = useStickyNotes();
  const currentDate = new Date().toISOString().split('T')[0];
  const upComingStickyNotes = stickyNotes.filter(
    (note) => note.date > currentDate
  );

  return (
    <div>
      <div className="container">
        <ul className="row">
          {upComingStickyNotes?.map((stickyNote) => (
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
  );
}
