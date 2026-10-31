import os
import json
import unittest

class TestQuizBank(unittest.TestCase):
    def setUp(self):
        # Locate quiz_bank.json
        possible_paths = [
            os.path.join(os.path.dirname(__file__), "..", "suraksha_quiz_pack", "data", "quiz_bank.json"),
            os.path.join(os.path.dirname(__file__), "..", "frontend", "src", "data", "quiz_bank.json"),
            os.path.join("suraksha_quiz_pack", "data", "quiz_bank.json"),
            os.path.join("frontend", "src", "data", "quiz_bank.json"),
        ]
        self.bank_path = None
        for p in possible_paths:
            if os.path.exists(p):
                self.bank_path = os.path.abspath(p)
                break
        
        self.assertIsNotNone(self.bank_path, "quiz_bank.json must exist in project")
        with open(self.bank_path, "r", encoding="utf-8") as f:
            self.data = json.load(f)

    def test_schema_and_defaults(self):
        self.assertEqual(self.data.get("schemaVersion"), "1.0")
        self.assertEqual(self.data.get("language"), "en")
        self.assertIn("defaults", self.data)
        self.assertEqual(self.data["defaults"].get("passingScorePercent"), 60)

    def test_unique_hazard_ids(self):
        hazards = self.data.get("hazards", [])
        self.assertGreater(len(hazards), 0)
        hazard_ids = [h["id"] for h in hazards]
        self.assertEqual(len(hazard_ids), len(set(hazard_ids)), "All hazard IDs must be unique")

    def test_unique_animation_ids(self):
        animations = self.data.get("animations", [])
        self.assertEqual(len(animations), 49, "Must contain exactly 49 animations")
        anim_ids = [a["animationId"] for a in animations]
        self.assertEqual(len(anim_ids), len(set(anim_ids)), "All animation IDs must be unique")

    def test_questions_validity_and_correct_index(self):
        animations = self.data.get("animations", [])
        all_question_ids = []
        total_questions = 0

        for a in animations:
            questions = a.get("questions", [])
            self.assertGreater(len(questions), 0, f"Animation {a['animationId']} must have questions")
            for q in questions:
                total_questions += 1
                q_id = q["id"]
                all_question_ids.append(q_id)

                self.assertTrue(q["question"].strip(), f"Question {q_id} has empty prompt")
                options = q.get("options", [])
                self.assertGreaterEqual(len(options), 2, f"Question {q_id} must have at least 2 options")
                
                correct_idx = q.get("correctIndex")
                self.assertIsInstance(correct_idx, int, f"Question {q_id} correctIndex must be int")
                self.assertTrue(0 <= correct_idx < len(options), 
                    f"Question {q_id} correctIndex {correct_idx} out of range [0, {len(options)-1}]")

                self.assertTrue(q.get("explanation", "").strip(), f"Question {q_id} missing explanation")

        self.assertEqual(total_questions, 173, "Total questions across all animations must be 173")
        self.assertEqual(len(all_question_ids), len(set(all_question_ids)), "All question IDs must be unique")

    def test_all_animations_map_to_files(self):
        base_dir = os.path.abspath("frontend/public/awareness-animations")
        animations = self.data.get("animations", [])

        unmatched = []
        for a in animations:
            src = a["animationSource"]
            target = os.path.join(base_dir, src.replace("/", os.sep))
            if not os.path.exists(target):
                # Fallback to normalized filename match
                fname = os.path.basename(src).lower()
                found = False
                for root, _, files in os.walk(base_dir):
                    for f in files:
                        if f.lower() == fname:
                            found = True
                            break
                    if found:
                        break
                if not found:
                    unmatched.append((a["animationId"], src))

        self.assertEqual(len(unmatched), 0, f"Unmatched animations found: {unmatched}")

if __name__ == "__main__":
    unittest.main()
