
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Gift,
  Star,
  Trophy,
  ShoppingBag,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const rewards = [
  {
    id: 1,
    title: "₹100 Shopping Voucher",
    points: 500,
    description: "Get ₹100 off on your next eligible order.",
  },
  {
    id: 2,
    title: "₹250 Shopping Voucher",
    points: 1000,
    description: "Get ₹250 off on your next eligible order.",
  },
  {
    id: 3,
    title: "Free Delivery",
    points: 750,
    description: "Get free delivery on your next order.",
  },
];

function Rewards() {
  const [points, setPoints] = useState(0);
  const [ordersCompleted, setOrdersCompleted] = useState(0);
  const [redeemedCount, setRedeemedCount] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch actual reward points and orders from backend
  useEffect(() => {
    const fetchRewards = async () => {
      const token = localStorage.getItem("retailhubToken");

      if (!token) {
        setError("Please log in to view your rewards.");
        setLoading(false);
        return;
      }

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [userResponse, ordersResponse] =
          await Promise.all([
            axios.get(
              "http://localhost:5000/api/auth/me",
              { headers }
            ),
            axios.get(
              "http://localhost:5000/api/orders/my-orders",
              { headers }
            ),
          ]);

        // Read the latest balance from MySQL
        const balance = Number(
          userResponse.data.user?.rewardPoints ?? 0
        );

        setPoints(balance);
        localStorage.setItem(
          "retailhubPoints",
          String(balance)
        );

        // Support common response formats
        const ordersData = ordersResponse.data;
        const orders = Array.isArray(ordersData)
          ? ordersData
          : Array.isArray(ordersData.orders)
          ? ordersData.orders
          : Array.isArray(ordersData.data)
          ? ordersData.data
          : [];

        const completedOrders = orders.filter((order) => {
          const status = String(order.status || "")
            .trim()
            .toLowerCase();

          return (
            status === "delivered" ||
            status === "order delivered"
          );
        });

        setOrdersCompleted(completedOrders.length);

        const savedRedeemed = Number(
          localStorage.getItem("retailhubRedeemed")
        );

        setRedeemedCount(
          Number.isFinite(savedRedeemed) &&
            savedRedeemed >= 0
            ? savedRedeemed
            : 0
        );

      } catch (err) {
        console.error("Rewards Error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load rewards. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, []);

  // Redeem reward (currently stored locally)
  const redeemReward = (reward) => {
    if (points < reward.points) {
      setMessage(
        `You need ${
          reward.points - points
        } more points to redeem this reward.`
      );
      return;
    }

    const remainingPoints = points - reward.points;
    const newRedeemedCount = redeemedCount + 1;

    setPoints(remainingPoints);
    setRedeemedCount(newRedeemedCount);

    localStorage.setItem(
      "retailhubPoints",
      String(remainingPoints)
    );

    localStorage.setItem(
      "retailhubRedeemed",
      String(newRedeemedCount)
    );

    setMessage(
      `${reward.title} redeemed successfully.`
    );
  };

  return (
    <div className="standard-page">

      {/* HEADER */}

      <div className="page-header">
        <div>
          <span className="eyebrow">
            CUSTOMER LOYALTY
          </span>

          <h1>Rewards</h1>

          <p>
            Earn points through shopping and
            redeem them for rewards.
          </p>
        </div>

        <div className="rewards-points-badge">
          <Star size={18} />
          {loading ? "Loading..." : `${points} Points`}
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div
          style={{
            background: "#FEF2F2",
            color: "#B91C1C",
            border: "1px solid #FECACA",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {/* REWARD OVERVIEW */}

      <section className="rewards-overview">
        <div className="rewards-main-card">
          <div className="rewards-icon">
            <Trophy size={30} />
          </div>

          <div>
            <span>Your Reward Points</span>

            <strong>
              {loading ? "..." : points}
            </strong>

            <p>
              Keep shopping to earn more points.
            </p>
          </div>
        </div>

        <div className="reward-stat">
          <div className="reward-stat-icon">
            <ShoppingBag size={20} />
          </div>

          <div>
            <span>Orders Completed</span>

            <strong>
              {loading ? "..." : ordersCompleted}
            </strong>
          </div>
        </div>

        <div className="reward-stat">
          <div className="reward-stat-icon">
            <Gift size={20} />
          </div>

          <div>
            <span>Rewards Redeemed</span>

            <strong>{redeemedCount}</strong>
          </div>
        </div>
      </section>

      {/* HOW TO EARN */}

      <section className="rewards-earn-section">
        <div className="section-heading-row">
          <div>
            <h2>How to Earn Points</h2>

            <p>
              Your shopping activity helps you
              earn loyalty points.
            </p>
          </div>
        </div>

        <div className="earn-grid">
          <div className="earn-card">
            <div className="earn-icon">
              <ShoppingBag size={21} />
            </div>

            <div>
              <h3>Shop with RetailHub</h3>

              <p>
                Earn points when you
                successfully complete purchases.
              </p>
            </div>
          </div>

          <div className="earn-card">
            <div className="earn-icon">
              <Star size={21} />
            </div>

            <div>
              <h3>Earn More Points</h3>

              <p>
                Larger purchases and selected
                offers can provide additional
                points.
              </p>
            </div>
          </div>

          <div className="earn-card">
            <div className="earn-icon">
              <Trophy size={21} />
            </div>

            <div>
              <h3>Redeem Rewards</h3>

              <p>
                Use your accumulated points to
                claim available customer rewards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AVAILABLE REWARDS */}

      <section className="available-rewards">
        <div className="section-heading-row">
          <div>
            <h2>Available Rewards</h2>

            <p>
              Use your points to redeem customer
              benefits.
            </p>
          </div>

          <span className="return-count">
            {loading ? "Loading..." : `${points} Points Available`}
          </span>
        </div>

        {message && (
          <div className="reward-message">
            <CheckCircle size={18} />
            {message}
          </div>
        )}

        <div className="rewards-grid">
          {rewards.map((reward) => {
            const canRedeem =
              !loading &&
              !error &&
              points >= reward.points;

            return (
              <div
                className="reward-card"
                key={reward.id}
              >
                <div className="reward-card-icon">
                  <Gift size={25} />
                </div>

                <h3>{reward.title}</h3>

                <p>{reward.description}</p>

                <div className="reward-card-footer">
                  <div>
                    <span>Required Points</span>

                    <strong>{reward.points}</strong>
                  </div>

                  <button
                    className={
                      canRedeem
                        ? "primary-button"
                        : "disabled-button"
                    }
                    onClick={() => redeemReward(reward)}
                    disabled={!canRedeem}
                  >
                    {loading
                      ? "Loading..."
                      : canRedeem
                      ? "Redeem"
                      : "Not Enough Points"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SHOPPING CTA */}

      <section className="rewards-cta">
        <div>
          <span className="eyebrow">
            KEEP SHOPPING
          </span>

          <h2>
            Earn more points with every
            purchase.
          </h2>

          <p>
            Explore our products and continue
            building your RetailHub rewards
            balance.
          </p>
        </div>

        <Link
          to="/products"
          className="primary-button"
        >
          Shop Products
          <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  );
}

export default Rewards;