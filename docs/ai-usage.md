# บันทึกการใช้งาน AI และการตัดสินใจ (AI Usage & Decision Log) — StepForward

เอกสารฉบับนี้จัดทำขึ้นตามกติกาการใช้งาน AI ของโครงการ TIIS เพื่อระบุเครื่องมือที่ใช้ วัตถุประสงค์ ขั้นตอนการทำงานร่วมกับ AI ข้อความคำสั่ง (Prompt) และจุดที่มนุษย์เป็นผู้ตัดสินใจ ตรวจสอบ และปรับแก้ด้วยตนเองค่ะ

---

## 1. เครื่องมือ AI ที่ใช้งาน (AI Tools Used)

**เครื่องมือ:** ChatGPT / Codex

**วัตถุประสงค์ในการใช้งาน:**
- ร่วมระดมความคิดเกี่ยวกับปัญหาอุปสรรคของกลุ่มเป้าหมาย และแนวทางในการแก้ปัญหา
- ช่วยวางโครงสร้างฟังก์ชันการทำงานของระบบ (System Workflow) และ User Flow
- ช่วยสร้างโค้ดเริ่มต้นและปรับแต่งส่วนประกอบของเว็บแอปพลิเคชัน (Next.js / TypeScript)
- ร่วมทบทวนเงื่อนไขการตรวจสอบความถูกต้องของข้อมูล (Validation Rules), กรณีขอบเขต (Edge Cases) และแนวทางการเขียนชุดทดสอบ

**การตัดสินใจและความรับผิดชอบของมนุษย์ (Human Responsibilities):**
- **การเลือกปัญหาและกลุ่มเป้าหมาย:** ดิฉันเป็นผู้กำหนดกลุ่มเป้าหมายหลัก (ผู้เริ่มทำงาน Early-career workers) กำหนดขอบเขตโครงการนำร่อง 6 สัปดาห์ และตัดสินใจเลือกฟังก์ชันสำคัญที่ตอบโจทย์ทีมงาน 3 คนและงบประมาณ 30,000 บาทค่ะ
- **การตรวจสอบและปรับแก้โค้ด:** ดิฉันเป็นผู้ตรวจสอบโค้ดที่ AI สร้างขึ้น รันแอปพลิเคชันจริง ตรวจสอบการทำงานของทุกฟังก์ชัน ดำเนินการทดสอบระบบ (Test Cases) ทั้งหมดด้วยตนเอง และบันทึกข้อจำกัดของระบบอย่างโปร่งใสค่ะ

---

## 2. ตัวอย่างการทำงานร่วมกับ AI (Examples of AI-Assisted Work)

### ตัวอย่างที่ 1: การวางแผนปัญหาและแนวทางการแก้ปัญหา (Problem and Solution Planning)

**Prompt:**  
"Help me design a learner progress and support tracking system for a six-week learning program with 60 participants and a three-person support team."

**สรุปผลลัพธ์จาก AI (Output Summary):**  
AI เสนอแนวคิดระบบ **StepForward** ซึ่งเป็นระบบติดตามความก้าวหน้าและการดูแลผู้เรียน ออกแบบมาเพื่อช่วยให้ทีมงาน 3 คนสามารถดูแลผู้เรียน 60 คนได้อย่างมีประสิทธิภาพ ประกอบด้วยระบบเช็คอินของผู้เรียน, แดชบอร์ดทีมงานพร้อมการจัดลำดับความเร่งด่วนตามกฎ (Rule-based Prioritization), ระบบบันทึกการติดตามผล และประวัติกิจกรรมรายบุคคล พร้อมแนะนำ Data Model, สถานะการดูแล, ตารางนำร่อง และขอบเขตต้นแบบด้วย Next.js, TypeScript และ Tailwind CSS ค่ะ

**การตัดสินใจของดิฉัน (My Decision):**  
ดิฉันเลือกตัดทอนเฉพาะ Workflow สำคัญหนึ่งส่วนที่จำเป็นที่สุด (การเช็คอิน → การจัดลำดับคะแนน → การติดตามผลของทีม) เพื่อให้สามารถพัฒนา ทดสอบ และส่งมอบต้นแบบที่ใช้งานได้จริงภายในกรอบเวลาที่กำหนด โดยไม่เพิ่มฟีเจอร์ที่ซับซ้อนเกินจำเป็นค่ะ

---

### ตัวอย่างที่ 2: การพัฒนาซอฟต์แวร์ต้นแบบ (Software Development)

**Prompt:**  
"Build a web application called StepForward — a learner progress and support tracking system for a 6-week learning program with 60 participants and a 3-person support team.
Tech stack: Next.js App Router, TypeScript, Tailwind CSS, and localStorage. Use the existing project setup if one already exists.
Core features:
1. Learner check-in form: learning goal, progress update, confidence level (1–5), obstacles, and support request.
2. Support dashboard: display learners, filter by support status, and prioritize follow-up using clear, rule-based criteria.
3. Follow-up management: record support actions, update status, and maintain a history of check-ins and follow-ups.
4. Seed the app with realistic fictional data for 10 learners.
5. Persist changes in localStorage and provide a way to restore demo data.
6. Validate required fields, prevent duplicate submissions, and show clear success and error messages.
7. Responsive, accessible UI that works well on mobile phones and desktop.
Design: Clean, professional, minimal dashboard with clear typography, restrained colors, useful status indicators, and intuitive navigation. Use Thai-friendly UI text where appropriate.
Requirements:
- Make the main workflow functional end-to-end, not just a static mockup.
- Keep the implementation simple and explainable.
- Do not add authentication, external APIs, paid services, or unnecessary AI features.
- Handle corrupted or unavailable localStorage gracefully.
- Add basic automated tests for validation and prioritization logic if time permits.
- Include a README with setup instructions, design decisions, limitations, and test instructions.
- Run the app and relevant tests, fix errors, and report what was actually verified.
- Do not claim tests passed unless they were executed successfully.
Start by inspecting the project environment, then implement the smallest complete working version. Summarize the files created, commands to run, and any remaining issues."

**สรุปผลลัพธ์จาก AI (Output Summary):**  
AI สร้างโค้ดสำหรับแอปพลิเคชันตามฟังก์ชันหลักที่กำหนด รวมถึงคอมโพเนนต์หน้าเว็บ ตรรกะการคำนวณคะแนนความเร่งด่วน และการบันทึกใน LocalStorage ค่ะ

**การตรวจสอบของดิฉัน (My Verification):**  
ดิฉันทำการรันแอปพลิเคชันจริง ตรวจสอบการทำงานของแต่ละฟังก์ชัน และทดสอบกรณีการใช้งานทั้งกรณีปกติและกรณีผิดพลาด โดยบันทึกผลการทดสอบจริงไว้ในเอกสาร [`docs/test-cases.md`](file:///d:/Personal/stepforward/docs/test-cases.md) เรียบร้อยแล้วค่ะ

---

## 3. การตรวจสอบและจุดที่ปรับแก้โดยมนุษย์ (Review and Human Decisions)

ข้อเสนอและโค้ดที่ AI แนะนำถูกมองเป็นเพียงทางเลือกเบื้องต้น ไม่ได้ถูกนำมาใช้งานโดยปราศจากการตรวจสอบ โดยมีจุดสำคัญที่ดิฉันตัดสินใจปรับแก้ด้วยตนเองดังนี้ค่ะ:

1. **การป้องกันการทำรายการซ้ำ (Duplicate Protection):**  
   เดิมแนวคิดแรกอาจเป็นการจำกัดไม่ให้ผู้เรียนเช็คอินซ้ำในวันเดียวกัน แต่ดิฉันพิจารณาแล้วว่าในความเป็นจริง ผู้เรียนอาจมีความคืบหน้าเพิ่มเติมในช่วงบ่ายและต้องการบันทึกเพิ่ม จึงตัดสินใจปรับเป็นระบบ **Idempotency Key ประจำรอบฟอร์ม (Submission ID)** แทน เพื่อป้องกันการกดปุ่ม Submit เบิ้ลซ้ำ แต่ยังอนุญาตให้ส่งความคืบหน้าใหม่ได้ในวันเดียวกันค่ะ
2. **การปรับปรุง UI และความง่ายในการใช้งาน (UI & Accessibility):**  
   เปลี่ยนจากการใช้ Native `<select>` ของเบราว์เซอร์ มาเป็น **Custom Dropdown** ที่ควบคุมขนาด การคลิก และการแสดงผลบนหน้าจอมือถือได้อย่างสวยงาม พร้อมทั้งจัดระเบียบปุ่ม Check-in ให้เหลือปุ่มหลักเพียงปุ่มเดียว เพื่อลดความสับสนของผู้ใช้ค่ะ
3. **การปรับบริบทข้อมูลตัวอย่าง (Thai Localization):**  
   ปรับชุดข้อมูลจำลองผู้เรียน 10 คนจากภาษาอังกฤษ ให้เป็นชื่อและเป้าหมายการพัฒนาทักษะที่สอดคล้องกับบริบทของคนไทยและกลุ่มผู้เริ่มทำงานจริงค่ะ

---

## 4. การทดสอบและข้อจำกัด (Testing and Limitations)

- ระบบได้รับการทดสอบจริงครอบคลุมทั้งกรณีปกติ (การบันทึกข้อมูลสำเร็จ, การคำนวณคะแนน Priority, การอัปเดตหลายครั้งในวันเดียวกัน) และกรณีผิดพลาด (ข้อมูลไม่ครบถ้วน, การส่งซ้ำ) โดยบันทึกผลตามที่รันผ่านจริง (`npm test` 7/7 ผ่าน) ทั้งหมดค่ะ
- ไม่มีการแต่งเติมผลการทดสอบหรือความคิดเห็นผู้ใช้ขึ้นมาเป็นข้อมูลจริงค่ะ
- ระบุข้อจำกัดของระบบอย่างโปร่งใส เช่น การเก็บข้อมูลแบบ Local-first ในเครื่อง และการไม่มีระบบ Authentication ตามขอบเขตโครงการนำร่องนะคะ

---

## 5. แหล่งอ้างอิงและส่วนประกอบที่นำมาใช้ (Sources and Dependencies)

- **Next.js Documentation:** https://nextjs.org/docs
- **TypeScript Documentation:** https://www.typescriptlang.org/docs/
- **Tailwind CSS Documentation:** https://tailwindcss.com/docs
- **Node.js Test Runner Documentation:** https://nodejs.org/api/test.html