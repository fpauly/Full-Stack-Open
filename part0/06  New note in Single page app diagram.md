sequenceDiagram
    participant browser
    participant server
    participant user
    
    Note right of browser: User writes a note and clicks 'Save', the browser executes JavaScript and loads SPA components
    
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: 201 Created (Note successfully created) { content: "Hi", date: "2025-01-10T12:02:55.358Z" }
    deactivate server

    Note right of browser: The browser updates the UI and adds the new note with the content "Hi" and the current date