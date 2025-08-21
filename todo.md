# 📝 TODO — Room Configurator App

A room configurator tool with two modes: **Builder** and **Viewer**.  

---

## 🔨 Builder Mode
- [ ] **New / Edit Existing Rooms**
  - [ ] Create new room
  - [ ] Load & edit existing saved rooms
  - [ ] Save room configuration (local + server)

- [ ] **Asset Management**
  - [ ] Add / remove 3D assets
  - [ ] Inputs for **position / rotation / scale**
    - [ ] Auto-save values on change
  - [ ] Add purchase URL to each asset
  - [ ] Add poll option:
    - [ ] Users can vote where to buy an item
    - [ ] Variations (colors, sizes, styles)
  - [ ] Chat thread per asset
    - [ ] Builder + all viewers can communicate
    - [ ] Markdown / emoji support

- [ ] **UI Enhancements**
  - [ ] Hierarchy / list view of all assets
  - [ ] Quick search & filter
  - [ ] Asset preview thumbnail

---

## 👀 Viewer Mode
- [ ] **Room Viewing**
  - [ ] View only mode (no editing)
  - [ ] Login with password for interaction rights
  - [ ] Interact:
    - [ ] View purchase links
    - [ ] Participate in polls
    - [ ] Comment in chat thread

---

## 🔗 General Features
- [ ] **Authentication**
  - [ ] Basic login system (password-protected rooms)
  - [ ] Role-based access (Builder vs Viewer)

- [ ] **Persistence**
  - [ ] Save/load room configs (DB + JSON export/import)
  - [ ] Version history / rollback

- [ ] **Collaboration**
  - [ ] Real-time sync for multiple viewers
  - [ ] Notifications when assets are updated / chats added

- [ ] **UI/UX**
  - [ ] Responsive layout for desktop + tablet
  - [ ] Dark / light mode toggle
  - [ ] Minimal clean design

---

## 🚀 Nice-to-Have (Future Ideas)
- [ ] Multi-room projects (house / office layouts)
- [ ] AR preview mode (place assets in real environment)
- [ ] Analytics (most clicked items, poll results dashboard)
- [ ] Export scene screenshots
- [ ] Integrate with e-commerce APIs (Amazon, IKEA, etc.)
- [ ] Customizable room backgrounds (textures, HDRI lighting)
- [ ] Export scene as blueprint or gltf/glb or .roomfig file.

---

## 📌 Notes
- Inputs for **position, rotation, scale** should **auto-save** on change (no save button).
- Builder can always override Viewer actions (polls/chats).
- Keep asset metadata (purchase links, chats, polls) synced with the scene.
- Focus first milestone on **Builder basic CRUD + Viewer password login**.

