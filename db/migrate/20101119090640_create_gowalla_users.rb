class CreateGowallaUsers < ActiveRecord::Migration
  def self.up
    create_table :gowalla_users do |t|
      t.string :name

      t.timestamps
    end
  end

  def self.down
    drop_table :gowalla_users
  end
end
