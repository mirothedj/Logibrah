module Logibra where

-- 1. Data Types (The Universe) --

data Modifier = Anchor | Prime
    deriving (Show, Eq)

data Polarity = P_UpRight   -- /+ (Q1)
              | P_DownRight -- \+ (Q4)
              | P_DownLeft  -- /- (Q3)
              | P_UpLeft    -- \- (Q2)
    deriving (Show, Eq)

data Expr = Unit [Modifier]          -- * with modifiers
          | Flow Expr Polarity       -- * -> Pol
          | Relation Expr Expr       -- A & B
          | Resolution               -- **
    deriving (Eq)

-- Custom Show for cleaner output
instance Show Expr where
    show (Unit mods) = "*" ++ concatMap showMod mods
      where showMod Anchor = "@"
            showMod Prime  = "'"
    show (Flow e p) = show e ++ " -> " ++ showPol p
      where showPol P_UpRight   = "/+"
            showPol P_DownRight = "\\+"
            showPol P_DownLeft  = "/-"
            showPol P_UpLeft    = "\\-"
    show (Relation a b) = "(" ++ show a ++ " & " ++ show b ++ ")"
    show Resolution = "**"

-- 2. The Logic (Reduction Engine) --

-- Quadrant-Dominant Inversion Logic
-- Only opposite slope AND opposite sign cancel.
areInverses :: Polarity -> Polarity -> Bool
areInverses P_UpRight P_UpLeft    = True  -- /+ cancels \-
areInverses P_UpLeft  P_UpRight   = True
areInverses P_DownRight P_DownLeft = True -- \+ cancels /-
areInverses P_DownLeft P_DownRight = True
areInverses _ _                   = False

reduce :: Expr -> Expr
reduce Resolution = Resolution
reduce (Unit m) = Unit m
reduce (Flow e p) =
    let re = reduce e in
    case re of
        Resolution -> Resolution -- Flow cannot contain resolved state
        _          -> Flow re p

reduce (Relation a b) =
    let ra = reduce a
        rb = reduce b
    in case (ra, rb) of
        (Resolution, _) -> Resolution -- Absorption rule
        (_, Resolution) -> Resolution

        -- The Core Cancellation Rule
        (Flow u1 p1, Flow u2 p2) ->
            if u1 == u2 && areInverses p1 p2
            then Resolution
            else Relation ra rb

        -- Default: keep relation
        _ -> Relation ra rb

-- 3. Simple Test Runner --

main :: IO ()
main = do
    putStrLn "--- Logibra Haskell Reducer ---"

    -- Test 1: Cancellation (* -> /+) & (* -> \-)
    let t1 = Relation (Flow (Unit []) P_UpRight) (Flow (Unit []) P_UpLeft)
    printTestCase "Standard Opposition" t1

    -- Test 2: Conflict (* -> /+) & (* -> /+)
    let t2 = Relation (Flow (Unit []) P_UpRight) (Flow (Unit []) P_UpRight)
    printTestCase "Conflict (Same Pol)" t2

    -- Test 3: Anchored Flow (*@ -> \+)
    let t3 = Flow (Unit [Anchor]) P_DownRight
    printTestCase "Anchored Flow" t3

printTestCase :: String -> Expr -> IO ()
printTestCase name expr = do
    putStrLn $ "Test: " ++ name
    putStrLn $ "Input:  " ++ show expr
    putStrLn $ "Output: " ++ show (reduce expr)
    putStrLn "----------------"
