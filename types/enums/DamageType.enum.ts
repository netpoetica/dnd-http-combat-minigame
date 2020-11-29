// Although storing as numbers would be more efficient than strings,
// that would tie data to enum definition order and make it less
// intuitive for third-party systems to know which number represents
// which type of damage. Therefore, using strings here.
export enum DamageType {
    // Melee
    Bludgeoning = "bludgening",
    Piercing = "piecing",
    Slashing = "slashing",

    // Magic
    Acid = "acid",
    Cold = "cold",
    Fire = "fire",
    Force = "force",
    Lightning = "lightning",
    Necrotic  = "necrotic",
    Poison  = "poison",
    Psychic =  "psychic",
    Radiant = "radiant",
    Thunder = "thunder"
}