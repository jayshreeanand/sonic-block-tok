export const IDL = {
  "version": "0.1.0",
  "name": "blocktok",
  "instructions": [
    {
      "name": "initializeContent",
      "accounts": [
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "content",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "contentId",
          "type": "string"
        },
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "contentUrl",
          "type": "string"
        },
        {
          "name": "contentType",
          "type": "string"
        }
      ]
    },
    {
      "name": "updateAnalytics",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "content",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "views",
          "type": "u64"
        },
        {
          "name": "likes",
          "type": "u64"
        },
        {
          "name": "shares",
          "type": "u64"
        },
        {
          "name": "comments",
          "type": "u64"
        }
      ]
    },
    {
      "name": "mintNft",
      "accounts": [
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "content",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "masterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "symbol",
          "type": "string"
        },
        {
          "name": "uri",
          "type": "string"
        },
        {
          "name": "royaltyBasisPoints",
          "type": "u16"
        }
      ]
    },
    {
      "name": "setRoyaltyDistribution",
      "accounts": [
        {
          "name": "creator",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "content",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "royaltyPercentages",
          "type": {
            "vec": "u16"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Content",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "publicKey"
          },
          {
            "name": "contentId",
            "type": "string"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "contentUrl",
            "type": "string"
          },
          {
            "name": "contentType",
            "type": "string"
          },
          {
            "name": "createdAt",
            "type": "u64"
          },
          {
            "name": "nftMint",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "analytics",
            "type": {
              "defined": "ContentAnalytics"
            }
          },
          {
            "name": "royaltyRecipients",
            "type": {
              "vec": {
                "defined": "RoyaltyRecipient"
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "ContentAnalytics",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "views",
            "type": "u64"
          },
          {
            "name": "likes",
            "type": "u64"
          },
          {
            "name": "shares",
            "type": "u64"
          },
          {
            "name": "comments",
            "type": "u64"
          },
          {
            "name": "updatedAt",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "RoyaltyRecipient",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pubkey",
            "type": "publicKey"
          },
          {
            "name": "percentage",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "Creator",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "address",
            "type": "publicKey"
          },
          {
            "name": "verified",
            "type": "bool"
          },
          {
            "name": "share",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Unauthorized",
      "msg": "You are not authorized to perform this action"
    },
    {
      "code": 6001,
      "name": "NftAlreadyMinted",
      "msg": "NFT has already been minted for this content"
    },
    {
      "code": 6002,
      "name": "InvalidRoyaltyPercentage",
      "msg": "Invalid royalty percentage (must sum to 100%)"
    },
    {
      "code": 6003,
      "name": "InvalidRoyaltyData",
      "msg": "Invalid royalty distribution data"
    }
  ]
}; 