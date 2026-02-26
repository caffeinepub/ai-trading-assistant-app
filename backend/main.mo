import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Float "mo:core/Float";
import Order "mo:core/Order";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  // Portfolio Position Type and Management
  type Position = {
    ticker : Text;
    entryPrice : Float;
    quantity : Float;
    stopLoss : ?Float;
    takeProfit : ?Float;
  };

  module Position {
    public func compare(p1 : Position, p2 : Position) : Order.Order {
      Text.compare(p1.ticker, p2.ticker);
    };
  };

  let portfolioMap = Map.empty<Text, Position>();

  public shared ({ caller }) func addOrUpdatePosition(ticker : Text, entryPrice : Float, quantity : Float, stopLoss : ?Float, takeProfit : ?Float) : async () {
    let position : Position = {
      ticker;
      entryPrice;
      quantity;
      stopLoss;
      takeProfit;
    };
    portfolioMap.add(ticker, position);
  };

  public shared ({ caller }) func removePosition(ticker : Text) : async () {
    if (not portfolioMap.containsKey(ticker)) {
      Runtime.trap("Position does not exist");
    };
    portfolioMap.remove(ticker);
  };

  public query ({ caller }) func getAllPositions() : async [Position] {
    portfolioMap.values().toArray().sort();
  };

  // Watchlist Management
  let watchlistMap = Map.empty<Text, Text>();

  public shared ({ caller }) func addToWatchlist(ticker : Text, description : Text) : async () {
    if (watchlistMap.containsKey(ticker)) {
      Runtime.trap("Asset already in watchlist");
    };
    watchlistMap.add(ticker, description);
  };

  public shared ({ caller }) func removeFromWatchlist(ticker : Text) : async () {
    if (not watchlistMap.containsKey(ticker)) {
      Runtime.trap("Asset not found in watchlist");
    };
    watchlistMap.remove(ticker);
  };

  public query ({ caller }) func getWatchlist() : async [(Text, Text)] {
    watchlistMap.toArray();
  };

  // Daily Market Briefing
  var latestMarketBriefing : ?Text = null;

  public shared ({ caller }) func updateMarketBriefing(content : Text) : async () {
    latestMarketBriefing := ?content;
  };

  public query ({ caller }) func getLatestMarketBriefing() : async ?Text {
    latestMarketBriefing;
  };
};
