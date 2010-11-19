class AddGowallaIdToGowallaUser < ActiveRecord::Migration
  def self.up
    add_column :gowalla_users, :gowalla_id, :integer
  end

  def self.down
    remove_column :gowalla_users, :gowalla_id
  end
end
