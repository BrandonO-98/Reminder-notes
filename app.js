class App {
  constructor() {
    this.notes = JSON.parse(localStorage.getItem('notes')) || []
    this.clickedNoteId = '';

    this.$form = document.querySelector('#form');
    this.$notes = document.querySelector('#notes');
    this.$noteTitle = document.querySelector('#note-title');
    this.$noteText = document.querySelector('#note-text');
    this.$formButtons = document.querySelector('#form-buttons');
    this.$placeholder = document.querySelector('#placeholder');
    this.$closeButton = document.querySelector('#form-close-button')
    this.$modal = document.querySelector('.modal')
    this.$modalTitle = document.querySelector('.modal-title')
    this.$modalText = document.querySelector('.modal-text')
    this.$modalCloseButton = document.querySelector('.modal-close-button')
    this.addEventListeners();
    this.displayNotes();
  }
  addEventListeners() {
    document.body.addEventListener('click', event => {
      this.handleFormClick(event);
      this.openModal(event)
      this.useTools(event)
    });
    this.$form.addEventListener('submit', event => {
      event.preventDefault(); 
      const title = this.$noteTitle.value;   
      const text = this.$noteText.value;  
      const  hasNote = title || text;
      if (hasNote) this.addNote({title, text})
    });
    this.$closeButton.addEventListener('click', event => {
      // this stops the event click from bubbling up into the 
      //body.event listener (parent)
      event.stopPropagation();
      this.formClose();
    });
    this.$modalCloseButton.addEventListener('click', event => {
      // this stops the event click from bubbling up into the 
      //body.event listener (parent)
      event.stopPropagation();
      this.closeModal();
    })
  }
  // Check if the form contains the event.target element
  handleFormClick(event) {
    if (event.target.closest('.note')) return;
    console.log('handle')
    const title = this.$noteTitle.value;   
    const text = this.$noteText.value;  
    const  hasNote = title || text;
    const isFormClicked = this.$form.contains(event.target)
    if (isFormClicked) {
      this.formOpen();
    }
    else if (hasNote) {
      this.addNote({title, text})
    }
    else {
      this.formClose();
    }
  }

  formOpen() {
    this.$form.classList.add('form-open');
    this.$noteTitle.style.display = 'grid';
    this.$formButtons.style.display = 'grid';
  }

  formClose() {
    this.$form.classList.remove('form-open');
    this.$noteTitle.style.display = 'none';
    this.$formButtons.style.display = 'none';
    this.$noteTitle.value = '';
    this.$noteText.value = '';
  }

  openModal(event) {
    // don't open modal if you click on colors or trash can, in between is okay
    if (event.target.closest('.colors') || event.target.closest('#trash-can')) return; 
    // if there is no note null is the value of event.target.closest('.note')
    const clickedNote = event.target.closest('.note')
    if (clickedNote) {
      console.log('bubbling modal') 
      const [$clickedNoteTitle, $clickedNoteText] = clickedNote.children; 
      this.$modalTitle.value = $clickedNoteTitle.innerText
      this.$modalText.value = $clickedNoteText.innerText
      this.clickedNoteId = clickedNote.dataset.id
      this.$modal.classList.add('open-modal');
    }
  }

  closeModal() {
    const editedTitle = this.$modalTitle.value
    const editedText = this.$modalText.value
    // iterate through notes updating it with current values
    this.notes = this.notes.map(note => 
      note.id == this.clickedNoteId ? { ...note, title:editedTitle, text:editedText } 
      : note
    );
    this.$modal.classList.remove('open-modal')
    this.displayNotes();
  }

  useTools(event) {
    // end function if you are not clicking on a note
    if (!event.target.closest('.note')) return 
    // end if you are not clicking on a toolbar item
    if (!event.target.closest('.colors') && !event.target.closest('#trash-can')) return
    console.log('bubbling tools')
    this.clickedNoteId = event.target.closest('.note').dataset.id
    const colors = ['white', '#3da8e9', '#d7aefb', '#fbbc04', '#1ac467']
    const classes = ['.white','.blue', '.purple', '.orange', '.green']
    for (let i = 0; i<5; i++) {
      if (event.target.matches(classes[i])) {
        this.updateColor(colors[i]) 
      } 
    }
    if (event.target.matches('#trash-can')) {
      this.notes = this.notes.filter(note => 
        note.id != this.clickedNoteId
      ); 
    }
    this.displayNotes();
  }

  updateColor(color) {
    this.notes = this.notes.map(note => 
      note.id == this.clickedNoteId ? { ...note, color:color } 
      : note
    ); 
  }

  addNote(note) {
    const newNote = {
      title: note.title,
      text: note.text,
      color: 'white',
      id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1
    };
    this.notes= [...this.notes, newNote];
    this.displayNotes();
    this.formClose();
  }

  saveNotes() {
    localStorage.setItem('notes', JSON.stringify(this.notes))  
  }

  displayNotes() {
    this.$placeholder.style.display = this.notes.length ? 'none' : 'grid'
    this.saveNotes() 
    this.$notes.innerHTML = this.notes.map(note => {
      return `
      <div style="background:${note.color}" class="note" data-id='${note.id}'>
        <div class="note-title">${note.title || 'Note Title'}</div>
        <div class="note-text">${note.text}</div>
        <div class="toolbar-container">
          <img src="./trash.svg" alt="trash logo" id="trash-can">   
          <div class="colors">
            <div class="color white"></div>
            <div class="color blue"></div>
            <div class="color purple"></div>
            <div class="color orange"></div>
            <div class="color green"></div>
          </div>
        </div>
      </div>
    `}).join('')
  }

}
new App()