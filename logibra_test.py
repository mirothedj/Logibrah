from logibra import *

class LogibraVerifier:
    def __init__(self):
        self.passes = 0
        self.failures = 0

    def assert_eq(self, test_name, actual, expected):
        if str(actual) == str(expected):
            print(f"[\u2713] PASS: {test_name}")
            self.passes += 1
        else:
            print(f"[\u2718] FAIL: {test_name}")
            print(f"    Expected: {expected}")
            print(f"    Got:      {actual}")
            self.failures += 1

    def run_suite(self):
        print("\n=== STARTING CERTIFICATION SUITE ===\n")

        # 1. Test The Anchor (Φx)
        print("--- Test 1: Anchor Immutability ---")
        # Direct AST construction to test reducer isolation
        anchor_input = Unit(['@'])
        result = reduce(anchor_input)
        self.assert_eq("Anchor Identity", result, "*@")

        # 2. Test Idempotency (Stability)
        print("\n--- Test 2: Idempotency ---")
        complex_expr = Relation(
             Flow(Unit([]), '/+'), # * -> /+
             Flow(Unit([]), '\-')  # * -> \-
        )
        pass_1 = reduce(complex_expr) # Should be **
        pass_2 = reduce(pass_1)       # Should still be **
        self.assert_eq("Reduction Stability", pass_1, pass_2)

        # 3. Test Violation Preservation
        print("\n--- Test 3: Conflict Preservation ---")
        # Conflict: Up-Right vs Up-Right (* -> /+ & * -> /+)
        conflict_expr = Relation(
             Flow(Unit([]), '/+'),
             Flow(Unit([]), '/+')
        )
        result = reduce(conflict_expr)
        is_resolution = isinstance(result, Resolution)
        if not is_resolution:
            print(f"[\u2713] PASS: Conflict Retained")
            self.passes += 1
        else:
            print(f"[\u2718] FAIL: Conflict falsely resolved to **")
            self.failures += 1

        # 4. Test Quadrant Logic (The 'Option B' Lock)
        print("\n--- Test 4: Quadrant Precision ---")
        # * -> /+ (Up-Right) & * -> /- (Down-Left)
        # These are vertical neighbors, not diagonals. Should NOT resolve.
        neighbor_expr = Relation(
            Flow(Unit([]), '/+'),
            Flow(Unit([]), '/-')
        )
        result = reduce(neighbor_expr)

        if not isinstance(result, Resolution):
            print(f"[\u2713] PASS: Side-by-side quadrants rejected")
            self.passes += 1
        else:
            print(f"[\u2718] FAIL: Side-by-side quadrants incorrectly resolved")
            self.failures += 1

        print("\n==================================")
        print(f"Summary: {self.passes} Passed, {self.failures} Failed.")
        if self.failures == 0:
            print("SYSTEM STATUS: CERTIFIED")
        else:
            print("SYSTEM STATUS: UNSTABLE")

if __name__ == "__main__":
    verifier = LogibraVerifier()
    verifier.run_suite()
